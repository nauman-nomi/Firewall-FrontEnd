#!/usr/local/bin/python3.11

import os
import json
import cgi
import shutil
import re
import cgitb
import subprocess

cgitb.enable()


print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Headers: Content-Type, Authorization")
print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
print("Content-Type: application/json\n")

# Paths
CONF_PATH = "/usr/local/etc/nginx/conf.d"
MODSEC_PATH = "/usr/local/etc/nginx/modsec"
SSL_PATH = "/usr/local/etc/certificate"
NGINX_BIN = "/usr/local/sbin/nginx"
SUDO = "/usr/local/bin/sudo"
SERVICE = "/usr/sbin/service"

request_method = os.environ.get("REQUEST_METHOD", "GET")
route = os.environ.get("REQUEST_URI", "").split("/")[-1]

if request_method == "OPTIONS":
    print("Status: 204 No Content")
    print()
    exit(0)

form = cgi.FieldStorage()
inputs = {key: form.getfirst(key, "").strip() for key in form.keys()}

response = {"api_status": "fail", "message": "Unhandled route", "output": ""}

BLOCK_SCRIPT = "/usr/local/bin/block_maxmind_countries.sh"

COUNTRY_RE = re.compile(r'^\s*COUNTRIES=\"(.*?)\"', re.MULTILINE)

def save_uploaded_file(field, filepath):
    if field in form and hasattr(form[field], "file"):
        with open(filepath, "wb") as out_file:
            shutil.copyfileobj(form[field].file, out_file)
        return True
    return False

def run_nginx_test():
    try:
        # Run nginx config test
        test = subprocess.run([SUDO, NGINX_BIN, "-t"], capture_output=True, text=True)
        output = test.stdout + test.stderr

        if test.returncode == 0 and "successful" in output.lower():
            # Restart NGINX only if test successful
            restart = subprocess.run([SUDO, SERVICE, "nginx", "restart"], capture_output=True, text=True)
            return ("success", output.strip() + "\n" + restart.stdout + restart.stderr)
        else:
            return ("fail", output.strip())
    except Exception as e:
        return ("fail", f"Exception occurred: {str(e)}")

def create_http_conf(data):
    return f"""server {{
    listen {data['listenip']};
    server_name {data['domain']} www.{data['domain']};

    modsecurity {data['modSec']};
    modsecurity_rules_file /usr/local/etc/nginx/modsec/main.conf;
    modsecurity_rules_file /usr/local/etc/nginx/modsec/{data['domain'].split('.')[0]}.conf;

    location / {{
        proxy_pass http://{data['localip']};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }}
}}"""

def create_https_conf(data):
    protocols = ' '.join([p.strip() for p in data['ssl_protocols'].split(',')])
    return f"""server {{
    listen 80;
    server_name {data['domain']};
    return 301 https://$host$request_uri;
}}

server {{
    listen {data['listenip']} ssl;
    http2 {data['http2']};
    server_name {data['domain']};

    ssl_certificate /usr/local/etc/certificate/{data['domain']}/{data['domain']}.crt;
    ssl_certificate_key /usr/local/etc/certificate/{data['domain']}/{data['domain']}.key;
    ssl_session_cache shared:SSL:{data['ssl_session_cache']};
    ssl_session_timeout {data['ssl_session_timeout']};
    ssl_protocols {protocols};
    ssl_ciphers {data['ssl_ciphers']};
    ssl_prefer_server_ciphers {data['ssl_prefer_server_ciphers']};
    resolver {data['dns_resolver']} valid=300s;
    resolver_timeout {data['resolver_timeout']};
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    modsecurity {data['modSec']};
    modsecurity_rules_file /usr/local/etc/nginx/modsec/main.conf;
    modsecurity_rules_file /usr/local/etc/nginx/modsec/{data['domain'].split('.')[0]}.conf;

    location / {{
        proxy_pass http://{data['localip']};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        client_max_body_size {data['client_max_body_size']};
        proxy_buffering {data['proxy_buffering']};
        proxy_request_buffering {data['proxy_request_buffering']};
    }}

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {{
        root /usr/share/nginx/html;
    }}
    location ~ /\.* {{
        deny all;
    }}
}}"""

def create_modsec_conf(data):
    methods = '|'.join([m.strip() for m in data['whitemethod'].split(',')])
    return f"""SecRule REQUEST_METHOD \"!^(GET|POST)$\" \"id:10000,phase:1,deny,status:405,msg:'XYZ: Invalid HTTP method'\"
SecRuleEngine On
SecRule REQUEST_METHOD \"!@rx ^(HEAD|{methods})$\" 
  \"id:10010,phase:1,pass,nolog, 
  setvar:ip.rl_counter=+1, 
  expirevar:ip.rl_counter=60\"

SecRule IP:RL_COUNTER \"@gt 120\"
  \"id:10011,phase:1,deny,status:429,
  msg:'Rate limit exceeded: 120 requests/minute',
  tag:'security', 
  chain\"
  SecRule REQUEST_METHOD \"!@rx ^(HEAD|{methods})$\"

SecRule REMOTE_ADDR \"@ipMatch {data['Ipwhitelist']}\"\n  \"id:10012,phase:1,allow,nolog\" """ 

try:
    if route in ["createDomain", "updateDomain"]:
        domain = inputs.get("domain", "")
        conf_file = os.path.join(CONF_PATH, f"{domain}.conf")
        modsec_file = os.path.join(MODSEC_PATH, f"{domain.split('.')[0]}.conf")
        ssl_dir = os.path.join(SSL_PATH, domain)
        os.makedirs(ssl_dir, exist_ok=True)

        crt_saved = save_uploaded_file("certificate", os.path.join(ssl_dir, f"{domain}.crt"))
        key_saved = save_uploaded_file("certificatekey", os.path.join(ssl_dir, f"{domain}.key"))

        if not crt_saved:
            response["message"] = "Certificate (.crt) not uploaded"
        if not key_saved:
            response["message"] = "Certificate key (.key) not uploaded"

        conf_content = create_http_conf(inputs) if inputs.get('webtype', '').lower() == 'http' else create_https_conf(inputs)

        with open(conf_file, "w") as f:
            f.write(conf_content)

        with open(modsec_file, "w") as f:
            f.write(create_modsec_conf(inputs))

        status, output = run_nginx_test()
        response = {
            "api_status": status,
            "message": f"{route} domain configuration complete.",
            "output": output
        }

    elif route == "deleteDomain":
        domain = inputs.get("domain")
        if domain:
            conf_file = os.path.join(CONF_PATH, f"{domain}.conf")
            modsec_file = os.path.join(MODSEC_PATH, f"{domain.split('.')[0]}.conf")
            ssl_dir = os.path.join(SSL_PATH, domain)

            for path in [conf_file, modsec_file]:
                if os.path.exists(path):
                    os.remove(path)
            if os.path.exists(ssl_dir):
                shutil.rmtree(ssl_dir)

            status, output = run_nginx_test()
            response = {
                "api_status": status,
                "message": f"Deleted domain {domain} and configs.",
                "output": output
            }
        else:
            response["message"] = "No domain specified"

    elif route == "listDomain":
        result = []
        for filename in os.listdir(CONF_PATH):
            if not filename.endswith(".conf"):
                continue
            domain_name = filename.replace(".conf", "")
            conf_path = os.path.join(CONF_PATH, filename)
            modsec_path = os.path.join(MODSEC_PATH, domain_name.split('.')[0] + ".conf")

            with open(conf_path) as f:
                content = f.read()

            ip_port = ""
            modsec = "OFF"
            web_type = "http"

            listen_match = re.search(r"listen\\s+([\\d\\.]+)(:\\d+)?( ssl)?;", content)
            if listen_match:
                ip = listen_match.group(1)
                port = listen_match.group(2) or ":80"
                ip_port = f"{ip}{port}"
                if listen_match.group(3):
                    web_type = "https"

            modsec_match = re.search(r"modsecurity\\s+(on|off);", content, re.IGNORECASE)
            if modsec_match:
                modsec = modsec_match.group(1).upper()

            ip_whitelist = ""
            method_whitelist = ""

            try:
                with open(modsec_path) as f:
                    modsec_content = f.read()

                ip_match = re.search(r'SecRule REMOTE_ADDR "@ipMatch ([^\"]+)"', modsec_content)
                if ip_match:
                    ip_whitelist = ip_match.group(1)

                method_regex = re.search(r'SecRule REQUEST_METHOD.*\^\((.*?)\)\$', modsec_content)
                if method_regex:
                    all_methods = method_regex.group(1).split('|')
                    method_whitelist = ",".join([m for m in all_methods if m != "HEAD"])

            except Exception:
                pass

            result.append({
                "domain_name": domain_name,
                "ip_port": ip_port,
                "modSec": modsec,
                "web_type": web_type,
                "ip_whitelist": ip_whitelist,
                "method_whitelist": method_whitelist
            })
        print(json.dumps(result))
        exit(0)

    elif route == "listip":
        try:
            rcconf_path = "/etc/rc.conf"
            firewall_ip = None
            management_ip = None
            all_ips = []

            with open(rcconf_path) as f:
                lines = f.readlines()

            for line in lines:
                line = line.strip()

                # Extract firewall IP (example: firewall_ip="192.168.1.1")
                if "firewall_ip=" in line:
                    firewall_ip = line.split("=", 1)[1].strip().strip('"')
                
                # Extract management IP (example: management_ip="10.0.0.1")
                elif "management_ip=" in line:
                    management_ip = line.split("=", 1)[1].strip().strip('"')

                # Extract other IPs from ifconfig lines (e.g., ifconfig_em0="inet 192.168.1.100 netmask 255.255.255.0")
                elif line.startswith("ifconfig_") and "inet" in line:
                    match = re.search(r'inet\s+(\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        ip = match.group(1)
                        all_ips.append(ip)

            excluded_ips = {firewall_ip, management_ip}
            ip_list = [ip for ip in all_ips if ip and ip not in excluded_ips]

            response = {
                "api_status": "success",
                "message": "List of active non-management, non-firewall IPs",
                "ip_list": ip_list
            }
        except Exception as e:
            response = {
                "api_status": "fail",
                "message": f"Error parsing IPs: {str(e)}",
                "ip_list": []
            }

except Exception as e:
    import traceback
    response["message"] = f"Script crashed: {str(e)}"
    response["output"] = traceback.format_exc()

print(json.dumps(response))