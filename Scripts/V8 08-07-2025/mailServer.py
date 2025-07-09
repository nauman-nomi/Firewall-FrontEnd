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
TLS_POLICY_PATH = "/usr/local/etc/postfix/tls_policy"
MAIN_CF_PATH = "/usr/local/etc/postfix/main.cf"

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
    
def read_tls_policy():
    if not os.path.exists(TLS_POLICY_PATH):
        return []
    with open(TLS_POLICY_PATH, "r") as f:
        return f.read().splitlines()

def write_transport(lines):
    with open(TRANSPORT_PATH, "w") as f:
        f.write("\n".join(lines) + "\n")

def write_tlspolicy(lines):
    with open(TLS_POLICY_PATH, "w") as f:
        f.write("\n".join(lines) + "\n")

def read_main_cf():
    if not os.path.exists(MAIN_CF_PATH):
        return []
    with open(MAIN_CF_PATH, "r") as f:
        return f.read().splitlines()
    
def write_main_cf(lines):
    with open(MAIN_CF_PATH, "w") as f:
        f.write("\n".join(lines) + "\n")

def add_network(network):
    lines = read_main_cf()
    new_lines = []
    found = False

    for line in lines:
        if line.strip().startswith("mynetworks"):
            found = True
            key, val = line.split("=", 1)
            # Remove spaces around commas
            networks = [x.strip() for x in val.split(",") if x.strip()]
            if network not in networks:
                networks.append(network)
            new_line = f"{key.strip()} = {', '.join(networks)}"
            new_lines.append(new_line)
        else:
            new_lines.append(line)

    if not found:
        # If mynetworks not found, add at end
        new_lines.append(f"mynetworks = {network}")

    write_main_cf(new_lines)

def delete_network(network):
    lines = read_main_cf()
    new_lines = []
    found = False

    for line in lines:
        if line.strip().startswith("mynetworks"):
            found = True
            key, val = line.split("=", 1)
            networks = [x.strip() for x in val.split(",") if x.strip()]
            networks = [n for n in networks if n != network]
            new_val = ", ".join(networks) if networks else ""
            new_line = f"{key.strip()} = {new_val}"
            new_lines.append(new_line)
        else:
            new_lines.append(line)

    write_main_cf(new_lines)

def add_relay_domain(domain):
    lines = read_main_cf()
    new_lines = []
    found = False

    for line in lines:
        if line.strip().startswith("relay_domains"):
            found = True
            key, val = line.split("=", 1)
            domains = [x.strip() for x in val.split(",") if x.strip()]
            if domain not in domains and domain != "$mydomain":
                domains.append(domain)
            new_line = f"{key.strip()} = {', '.join(domains)}"
            new_lines.append(new_line)
        else:
            new_lines.append(line)

    if not found:
        new_lines.append(f"relay_domains = {domain}")

    write_main_cf(new_lines)

def delete_relay_domain(domain):
    lines = read_main_cf()
    new_lines = []
    found = False

    for line in lines:
        if line.strip().startswith("relay_domains"):
            found = True
            key, val = line.split("=", 1)
            domains = [x.strip() for x in val.split(",") if x.strip()]
            domains = [d for d in domains if d != domain]
            new_val = ", ".join(domains) if domains else ""
            new_line = f"{key.strip()} = {new_val}"
            new_lines.append(new_line)
        else:
            new_lines.append(line)

    write_main_cf(new_lines)


def get_mail_servers():
    lines = read_transport()
    servers = []
    for line in lines:
        if not line.strip():
            continue

        # Split comment part (network info) if present
        line_parts = line.split('#', 1)
        main_part = line_parts[0].strip()
        network = line_parts[1].strip() if len(line_parts) > 1 else ""

        parts = main_part.split()
        if len(parts) >= 2:
            domain = parts[0]
            entry = parts[1]
            cert_path = None

            if len(parts) == 3:
                cert_path = parts[2]

            ip = ""
            port = ""
            smtptype = ""
            if "smtp" in entry:
                # e.g. smtps:[34.34.3.4]:443
                try:
                    proto, address = entry.split(":", 1)
                    smtptype = proto.strip()
                    # Remove brackets and split IP and port
                    address = address.strip("[]")
                    if "]:" in entry:
                        ip, port = address.split("]:")
                    else:
                        ip_port = address.split(":")
                        if len(ip_port) == 2:
                            ip, port = ip_port
                        else:
                            ip = ip_port[0]
                            port = "25"  # default if no port
                except Exception:
                    ip = ""
                    port = ""

            servers.append({
                "domain": domain,
                "ip": ip.strip(),
                "port": port.strip(),
                "network": network,
                "smtptype": "smtps" if "smtps" in smtptype else "smtp",
                "certificate": cert_path if cert_path and os.path.exists(cert_path) else "N/A"
            })
    return servers



def add_or_edit_server(edit=False):
    smtptype = form.getfirst("smtptype", "").lower()
    domain = form.getfirst("domain", "")
    ip = form.getfirst("ip_address", "")
    network = form.getfirst("my_network", "")
    port = form.getfirst("port", "25")
    cert_file = form["pem_file"] if "pem_file" in form else None

    if not all([smtptype, domain, ip]):
        return {"status": "fail", "message": "Missing required fields."}

    lines = read_transport()
    tlspolicy_lines = read_tls_policy()

    lines = [line for line in lines if not line.startswith(domain)]
    tlspolicy_lines = [line for line in tlspolicy_lines if not line.startswith(domain)]

    add_network(network)
    add_relay_domain(domain)

    lines.append(f"{domain} smtp:[{ip}]:{port} # {network}")

    if smtptype == "smtp":
        # lines.append(f"{domain} smtp:[{ip}]:{port} ")
        tlspolicy_lines.append(f"{domain} none")

    elif smtptype == "smtps":
        
        tlspolicy_lines.append(f"{domain} encrypt")
        if cert_file is not None and cert_file.filename:
            cert_path = os.path.join(CERTS_DIR, f"{domain}.pem")
            with open(cert_path, "wb") as f:
                f.write(cert_file.file.read())
            # Update internal-ca.pem
            run_cmd(f"cat {cert_path} > {INTERNAL_CA_FILE}")
            run_cmd(f"openssl s_client -connect {domain}:{port} -CAfile {INTERNAL_CA_FILE}")
        else:
            return {"status": "fail", "message": "Certificate file required for smtps."}

    write_transport(lines)
    write_tlspolicy(tlspolicy_lines)
    run_cmd("postmap /etc/postfix/transport")
    run_cmd("postmap /usr/local/etc/postfix/tls_policy")
    run_cmd("service postfix reload")

    return {"status": "success", "message": f"{'Updated' if edit else 'Added'} {domain} mail server."}

def delete_server():
    domain = form.getfirst("domain", "")
    my_network = form.getfirst("my_network", "")
    if not domain:
        return {"status": "fail", "message": "Domain not provided."}

    delete_network(my_network)
    delete_relay_domain(domain) # delete domain form rely

    lines = read_transport()
    lines = [line for line in lines if not line.startswith(domain)]
    write_transport(lines)

    linestls = read_tls_policy()
    linestls = [line for line in linestls if not line.startswith(domain)]
    write_tlspolicy(linestls)

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
