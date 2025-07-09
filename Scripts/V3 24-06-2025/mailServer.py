#!/usr/local/bin/python3.11

import cgi
import os
import subprocess
import json
import cgitb

cgitb.enable()
request_method = os.environ.get("REQUEST_METHOD", "GET")

if request_method == "OPTIONS":
    print("Status: 204 No Content")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY")
    print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    print("Content-Type: text/plain")
    print()
    exit(0)

# Regular request
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY")
print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
print("Content-Type: application/json")
print()


form = cgi.FieldStorage()
route = os.environ.get('PATH_INFO', '').strip("/")

# Constants
TRANSPORT_PATH = "/usr/local/etc/postfix/transport"
CERTS_DIR = "/usr/local/etc/postfix/certs/backends"
INTERNAL_CA_FILE = "/usr/local/etc/postfix/certs/internal-ca.pem"

def run_cmd(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)

def read_transport():
    if not os.path.exists(TRANSPORT_PATH):
        return []
    with open(TRANSPORT_PATH, "r") as f:
        return f.read().splitlines()

def write_transport(lines):
    with open(TRANSPORT_PATH, "w") as f:
        f.write("\n".join(lines) + "\n")

def get_mail_servers():
    lines = read_transport()
    servers = []
    for line in lines:
        if not line.strip(): continue
        parts = line.split()
        if len(parts) == 2:
            domain, entry = parts
            if "smtp" in entry:
                ip = entry.split(":")[1].strip("[]")
                port = entry.split(":")[-1] if "smtps" in entry else "25"
                cert_path = os.path.join(CERTS_DIR, f"{domain}.pem")
                servers.append({
                    "domain": domain,
                    "ip": ip,
                    "port": port,
		    "smtptype": "smtps" if "smtps" in entry else "smtp",
                    "certificate": cert_path if os.path.exists(cert_path) else "N/A"
                })
    return servers

def add_or_edit_server(edit=False):
    smtptype = form.getfirst("smtptype", "").lower()
    domain = form.getfirst("domain", "")
    ip = form.getfirst("ip_address", "")
    port = form.getfirst("port", "25")
    cert_file = form["pem_file"] if "pem_file" in form else None

    if not all([smtptype, domain, ip]):
        return {"status": "fail", "message": "Missing required fields."}

    lines = read_transport()
    lines = [line for line in lines if not line.startswith(domain)]
    
    if smtptype == "smtp":
        lines.append(f"{domain}\tsmtp:[{ip}]")
    elif smtptype == "smtps":
        lines.append(f"{domain}\tsmtps:[{ip}]:{port}")
        if cert_file is not None and cert_file.filename:
            cert_path = os.path.join(CERTS_DIR, f"{domain}.pem")
            try:
                with open(cert_path, "wb") as f:
                    f.write(cert_file.file.read())
            except Exception as e:
                return {"status": "fail", "message": f"Failed to save certificate: {str(e)}"}

            # Update internal-ca.pem
            run_cmd(f"cat {cert_path} > {INTERNAL_CA_FILE}")
            run_cmd(f"openssl s_client -connect {ip}:{port} -CAfile {INTERNAL_CA_FILE}")
        else:
            return {"status": "fail", "message": "Certificate file required for smtps."}

    write_transport(lines)
    run_cmd("postmap /etc/postfix/transport")
    run_cmd("service postfix reload")

    return {"status": "success", "message": f"{'Updated' if edit else 'Added'} {domain} mail server."}

def delete_server():
    domain = form.getfirst("domain", "")
    if not domain:
        return {"status": "fail", "message": "Domain not provided."}

    lines = read_transport()
    lines = [line for line in lines if not line.startswith(domain)]
    write_transport(lines)

    cert_path = os.path.join(CERTS_DIR, f"{domain}.pem")
    if os.path.exists(cert_path):
        os.remove(cert_path)
        run_cmd(f"cat {cert_path} > {INTERNAL_CA_FILE}")

    run_cmd("postmap /etc/postfix/transport")
    run_cmd("service postfix reload")

    return {"status": "success", "message": f"Deleted mail server {domain}"}

def view_servers():
    servers = get_mail_servers()
    return {
        "status": "success",
        "message": f"{len(servers)} servers found.",
        "data": servers
    }

# Routing
if route == "addMailServer":
    print(json.dumps(add_or_edit_server(edit=False)))
elif route == "editMailServer":
    print(json.dumps(add_or_edit_server(edit=True)))
elif route == "deleteMailServer":
    print(json.dumps(delete_server()))
elif route == "viewMailServers":
    print(json.dumps(view_servers()))
else:
    print(json.dumps({"status": "fail", "message": "Invalid API route."}))
