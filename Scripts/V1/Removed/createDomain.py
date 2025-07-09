#!/usr/local/bin/python3.11

import os
import subprocess
import json
import cgi
import cgitb

cgitb.enable()

print("Content-Type: application/json\n")

def create_config_files_local(domain, conf_content, modsec_content, crt_file_obj, key_file_obj):
    try:
        base_path = "/usr/local/etc/nginx/"
        conf_d = os.path.join(base_path, "conf.d")
        modsec_d = os.path.join(base_path, "modsec")
        cert_d = "/usr/local/etc/certificate/"

        os.makedirs(conf_d, exist_ok=True)
        os.makedirs(modsec_d, exist_ok=True)
        os.makedirs(cert_d, exist_ok=True)

        conf_file = os.path.join(conf_d, f"{domain}.conf")
        modsec_file = os.path.join(modsec_d, f"{domain.split('.')[0]}.conf")
        crt_file = os.path.join(cert_d, f"{domain}.crt")
        key_file = os.path.join(cert_d, f"{domain}.key")

        # Check if files already exist
        if os.path.exists(conf_file) or os.path.exists(modsec_file):
            return False, f"File already exists."

        with open(conf_file, 'w') as f:
            f.write(conf_content)

        with open(modsec_file, 'w') as f:
            f.write(modsec_content)

        # Save certificate files
        if crt_file_obj and crt_file_obj.file:
            with open(crt_file, 'wb') as f:
                f.write(crt_file_obj.file.read())

        if key_file_obj and key_file_obj.file:
            with open(key_file, 'wb') as f:
                f.write(key_file_obj.file.read())

        # subprocess.run(["service", "nginx", "configtest"], check=True)
        # subprocess.run(["service", "nginx", "restart"], check=True)

        return True, "✅ Config files created and Nginx reloaded."

    except subprocess.CalledProcessError as se:
        return False, f"❌ Nginx reload error: {se}"
    except Exception as e:
        return False, f"❌ Exception: {e}"

# Parse POST form data
form = cgi.FieldStorage()

domain = form.getfirst('domain', '').strip()
listenip = form.getfirst('listenip', '').strip()
localip = form.getfirst('localip', '').strip()
webtype = form.getfirst('webtype', '').strip().lower()
modSec = form.getfirst('modSec', 'on')
Ipwhitelist = form.getfirst('Ipwhitelist', '')
whitemethod = form.getfirst('whitemethod', 'GET')

crt_file = form['certificate'] if 'certificate' in form else None
key_file = form['certificateKey'] if 'certificateKey' in form else None

# SSL variables
ssl_crt = ssl_key = ssl_var = ""
if webtype == "https":
    ssl_var = " ssl"
    ssl_crt = f"ssl_certificate /usr/local/etc/certificate/{domain}.crt;"
    ssl_key = f"ssl_certificate_key /usr/local/etc/certificate/{domain}.key;"

# Build config content
conf_content = f"""
server {{
    listen {listenip}{ssl_var};
    server_name {domain} www.{domain};

    modsecurity {modSec};
    modsecurity_rules_file /usr/local/etc/nginx/modsec/main.conf;
    modsecurity_rules_file /usr/local/etc/nginx/modsec/rules/abc.conf;

    {ssl_crt}
    {ssl_key}

    location / {{
        proxy_pass {localip};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }}
}}
"""

modsec_content = f"""
SecRule REQUEST_METHOD "!^(GET|POST)$" "id:10000,phase:1,deny,status:405,msg:'XYZ: Invalid HTTP method'"
SecRuleEngine On
SecRule REQUEST_METHOD "!@rx ^(HEAD|{whitemethod})$" "id:10010,phase:1,pass,nolog,setvar:ip.rl_counter=+1,expirevar:ip.rl_counter=60"
SecRule IP:RL_COUNTER "@gt 120" "id:10011,phase:1,deny,status:429,msg:'Rate limit exceeded',chain"
SecRule REMOTE_ADDR "@ipMatch {Ipwhitelist}" "id:10012,phase:1,allow,nolog"
"""

success, msg = create_config_files_local(domain, conf_content, modsec_content, crt_file, key_file)

print(json.dumps({
    "success": success,
    "message": msg
}))
