#!/usr/local/bin/python3.11

import os
import json
import cgi
import shutil
import re
import cgitb
import subprocess

request_method = os.environ.get("REQUEST_METHOD", "GET")
if request_method == "OPTIONS":
    print("Status: 204 No Content")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Headers: Content-Type, Authorization")
    print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    print("Content-Type: text/plain")
    print()
    exit(0)

# Regular request
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Headers: Content-Type, Authorization")
print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
print("Content-Type: application/json")
print()

cgitb.enable()

# Paths
CONF_PATH = "/usr/local/etc/nginx/conf.d"
MODSEC_PATH = "/usr/local/etc/nginx/modsec"
SSL_PATH = "/usr/local/etc/certificate"
NGINX_BIN = "/usr/local/sbin/nginx"
SUDO = "/usr/local/bin/sudo"
SERVICE = "/usr/sbin/service"

route = os.environ.get("REQUEST_URI", "").split("/")[-1]

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
        test = subprocess.run([SUDO, NGINX_BIN, "-t"], capture_output=True, text=True)
        output = test.stdout + test.stderr

        if test.returncode == 0 and "successful" in output.lower():
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
    if route == "listDomain":
        result = []
        for filename in os.listdir(CONF_PATH):
            if not filename.endswith(".conf"):
                continue
            domain_name = filename.replace(".conf", "")
            conf_path = os.path.join(CONF_PATH, filename)
            modsec_path = os.path.join(MODSEC_PATH, domain_name.split('.')[0] + ".conf")

            with open(conf_path) as f:
                content = f.read()

            data = {
                "domain_name": domain_name,
                "ip_port": "",
                "modSec": "OFF",
                "web_type": "http",
                "ip_whitelist": "",
                "method_whitelist": "",
                "http2": "",
                "ssl_session_cache": "",
                "ssl_session_timeout": "",
                "ssl_protocols": "",
                "ssl_ciphers": "",
                "ssl_prefer_server_ciphers": "",
                "dns_resolver": "",
                "resolver_timeout": "",
                "client_max_body_size": "",
                "proxy_buffering": "",
                "proxy_request_buffering": ""
            }

            listen_match = re.search(r"listen\s+([\d\.]+)(?::(\d+))?( ssl)?;", content)
            if listen_match:
                ip = listen_match.group(1)
                port = listen_match.group(2) or "80"
                data["ip_port"] = f"{ip}:{port}"
                if listen_match.group(3):
                    data["web_type"] = "https"

            for field in data:
                if field in content:
                    val_match = re.search(rf"{field}\s+(.*?);", content)
                    if val_match:
                        data[field] = val_match.group(1).strip()

            try:
                with open(modsec_path) as f:
                    modsec_content = f.read()

                ip_match = re.search(r'SecRule REMOTE_ADDR "@ipMatch ([^\"]+)"', modsec_content)
                if ip_match:
                    data["ip_whitelist"] = ip_match.group(1)

                method_match = re.search(r'SecRule REQUEST_METHOD.*\^\((.*?)\)\$', modsec_content)
                if method_match:
                    methods = method_match.group(1).split('|')
                    data["method_whitelist"] = ",".join([m for m in methods if m != "HEAD"])
            except Exception:
                pass

            result.append(data)

        print(json.dumps(result))
        exit(0)

except Exception as e:
    import traceback
    response["message"] = f"Script crashed: {str(e)}"
    response["output"] = traceback.format_exc()

print(json.dumps(response))
