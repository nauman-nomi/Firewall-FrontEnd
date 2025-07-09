#!/usr/local/bin/python3.11

import os
import cgi
import subprocess
import json
import cgitb

cgitb.enable()
print("Content-Type: application/json\n")

# Get route from URL
route = os.environ.get('PATH_INFO', '').strip('/')
form = cgi.FieldStorage()
ip_address = form.getfirst('ip_address', '').strip()

def run_cmd(command):
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=3)
        if result.returncode == 0:
            return True, result.stdout.strip()
        else:
            return False, result.stderr.strip() or "Unknown error"
    except Exception as e:
        return False, f"Exception: {str(e)}"

def add_ip(ip):
    return run_cmd(f"/usr/local/bin/sudo /sbin/pfctl -t whitelist-ip -T add {ip}")

def delete_ip(ip):
    return run_cmd(f"/usr/local/bin/sudo /sbin/pfctl -t whitelist-ip -T delete {ip}")

def show_ips():
    return run_cmd("/usr/local/bin/sudo /sbin/pfctl -t whitelist-ip -T show")

def search_ip(ip):
    return run_cmd(f"/usr/local/bin/sudo /sbin/pfctl -t whitelist-ip -T show | grep {ip}")

def response(success, message, data=None):
    print(json.dumps({
        "api_status": "success" if success else "fail",
        "message": message,
        "data": data or []
    }))

# Route handler
if route == "addMaliciousIP":
    if ip_address:
        ok, msg = add_ip(ip_address)
        if ok and not msg:
            msg = f"IP {ip_address} added to whitelist."
        response(ok, msg)
    else:
        response(False, "IP address not provided.")

elif route == "deleteMaliciousIP":
    if ip_address:
        ok, msg = delete_ip(ip_address)
        if ok and not msg:
            msg = f"IP {ip_address} deleted from whitelist."
        response(ok, msg)
    else:
        response(False, "IP address not provided.")

elif route == "listMaliciousIP":
    ok, msg = show_ips()
    if ok:
        ips = msg.splitlines() if msg else []
        response(True, "Whitelist IPs retrieved.", ips if ips else ["No IPs in the whitelist."])
    else:
        response(False, msg)

elif route == "searchMaliciousIP":
    if ip_address:
        ok, msg = search_ip(ip_address)
        if ok and msg:
            response(True, f"IP {ip_address} is in whitelist.", [msg])
        else:
            response(False, f"IP {ip_address} not found in whitelist.")
    else:
        response(False, "IP address not provided.")

else:
    response(False, f"Invalid route: {route}")
