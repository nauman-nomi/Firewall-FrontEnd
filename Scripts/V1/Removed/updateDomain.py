#!/usr/local/bin/python3.11

import os
import subprocess
import json
import cgi
import cgitb
import shutil

cgitb.enable()
print("Content-Type: application/json\n")

def update_config_files(domain, conf_content, modsec_content, crt_file_obj, key_file_obj):
    base_path = "/usr/local/etc/nginx/"
    conf_d = os.path.join(base_path, "conf.d/")
    modsec = os.path.join(base_path, "modsec/")
    cert_dir_base = "/usr/local/etc/certificate/"
    cert_dir = os.path.join(cert_dir_base, domain)  # Per-domain cert folder

    conf_file = os.path.join(conf_d, f"{domain}.conf")
    modsec_file = os.path.join(modsec, f"{domain.split('.')[0]}.conf")
    crt_file = os.path.join(cert_dir, f"{domain}.crt")
    key_file = os.path.join(cert_dir, f"{domain}.key")

    try:
        # Ensure required directories exist
        for directory in [conf_d, modsec, cert_dir_base]:
            os.makedirs(directory, exist_ok=True)

        # Recreate the certificate directory (delete old contents)
        if os.path.exists(cert_dir):
            shutil.rmtree(cert_dir)
        os.makedirs(cert_dir)

        # Write conf file
        with open(conf_file, 'w') as f:
            f.write(conf_content)

        # Write ModSecurity config
        with open(modsec_file, 'w') as f:
            f.write(modsec_content)

        # Write certificate and key if provided
        if crt_file_obj and crt_file_obj.filename:
            crt_file_obj.file.seek(0)
            with open(crt_file, 'wb') as f:
                f.write(crt_file_obj.file.read())

        if key_file_obj and key_file_obj.filename:
            key_file_obj.file.seek(0)
            with open(key_file, 'wb') as f:
                f.write(key_file_obj.file.read())

        # Reload nginx
        subprocess.run(["/usr/local/bin/doas", "service", "nginx", "t"], check=True)
        subprocess.run(["/usr/local/bin/doas", "service", "nginx", "restart"], check=True)

        return True, "? Files updated and NGINX reloaded."

    except Exception as e:
        return False, f"? Local Error: {str(e)}"

# --- CGI handling starts here ---
form = cgi.FieldStorage()

domain = form.getvalue("domain")
conf_content = form.getvalue("conf_content", "")
modsec_content = form.getvalue("modsec_content", "")
crt_file = form["crt_file"] if "crt_file" in form else None
key_file = form["key_file"] if "key_file" in form else None

if not domain:
    print(json.dumps({"success": False, "message": "Missing domain parameter"}))
else:
    success, message = update_config_files(domain, conf_content, modsec_content, crt_file, key_file)
    print(json.dumps({"success": success, "message": message}))
