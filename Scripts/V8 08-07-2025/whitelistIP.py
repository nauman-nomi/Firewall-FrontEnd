#!/usr/local/bin/python3.11

import os
import cgi
import subprocess
import json
import cgitb

cgitb.enable()
# Preflight request for CORS
if os.environ.get("REQUEST_METHOD", "") == "OPTIONS":
    print("Content-Type: application/json")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    print("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key")
    print("")
    exit()

print("Content-Type: application/json")
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
print("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key")
print("")


# Get route from URL
route = os.environ.get('PATH_INFO', '').strip('/')
form = cgi.FieldStorage()
ip_address = form.getfirst('ip_address', '').strip()


WHITELIST_FILE = "/etc/pf/tables/whitelist_ips.list"
PF_TABLE_NAME = "whitelist_ips"

def run_cmd(cmd_list):
    import subprocess
    try:
        result = subprocess.run(
            cmd_list,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            return True, result.stdout.strip()
        else:
            return False, result.stderr.strip() or "Unknown error"
    except subprocess.TimeoutExpired:
        return False, "Command timed out."
    except Exception as e:
        return False, str(e)

def read_whitelist_file():
    if not os.path.exists(WHITELIST_FILE):
        return []
    with open(WHITELIST_FILE, "r") as f:
        return [line.strip() for line in f if line.strip()]

def write_whitelist_file(ip_list):
    with open(WHITELIST_FILE, "w") as f:
        for ip in sorted(set(ip_list)):
            f.write(f"{ip}\n")

def reload_pf_table_from_file():
    return run_cmd([
        "/usr/local/bin/sudo",
        "/sbin/pfctl",
        "-t", PF_TABLE_NAME,
        "-T", "replace",
        "-f", WHITELIST_FILE
    ])

def add_ip(ip):
    whitelist = read_whitelist_file()
    if ip not in whitelist:
        whitelist.append(ip)
        write_whitelist_file(whitelist)
    return reload_pf_table_from_file()

def delete_ip(ip):
    whitelist = read_whitelist_file()
    if ip in whitelist:
        whitelist.remove(ip)
        write_whitelist_file(whitelist)
    return reload_pf_table_from_file()

def show_ips():
    return True, "\n".join(read_whitelist_file())

def search_ip(ip):
    ok, output = show_ips()
    if not ok:
        return False, output
    ips = output.splitlines()
    found = [line for line in ips if line.strip() == ip]
    return True, found[0] if found else ""

def response(success, message, data=None):
    print(json.dumps({
        "api_status": "success" if success else "fail",
        "message": message,
        "data": data or []
    }))

# Route handler
if route == "addWhitelistIP":
    if ip_address:
        ok, msg = add_ip(ip_address)
        if ok and not msg:
            msg = f"IP {ip_address} added to Whitelist."
        response(ok, msg)
    else:
        response(False, "IP address not provided.")

elif route == "deleteWhitelistIP":
    if ip_address:
        ok, msg = delete_ip(ip_address)
        if ok and not msg:
            msg = f"IP {ip_address} deleted from Whitelist."
        response(ok, msg)
    else:
        response(False, "IP address not provided.")

elif route == "listWhitelistIP":
    ok, msg = show_ips()
    if ok:
        ips = msg.splitlines() if msg else []
        response(True, "Whitelist IPs retrieved.", ips if ips else ["No IPs in the Whitelist."])
    else:
        response(False, msg)

elif route == "searchWhitelistIP":
    if ip_address:
        ok, msg = search_ip(ip_address)
        if ok and msg:
            response(True, f"IP {ip_address} is in Whitelist.", [msg])
        else:
            response(False, f"IP {ip_address} not found in Whitelist.")
    else:
        response(False, "IP address not provided.")

else:
    response(False, f"Invalid route: {route}")


