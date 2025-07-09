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

def run_cmd(cmd_list):
    """
    Run a command safely and capture output.
    """
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
        return False, f"Exception: {str(e)}"

def add_ip(ip):
    return run_cmd([
        "/usr/local/bin/sudo",
        "/sbin/pfctl",
        "-t", "malicious_ips",
        "-T", "add", ip
    ])

def delete_ip(ip):
    return run_cmd([
        "/usr/local/bin/sudo",
        "/sbin/pfctl",
        "-t", "malicious_ips",
        "-T", "delete", ip
    ])

def show_ips():
    return run_cmd([
        "/usr/local/bin/sudo",
        "/sbin/pfctl",
        "-t", "malicious_ips",
        "-T", "show"
    ])

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
if route == "addMaliciousIP":
    if ip_address:
        ok, msg = add_ip(ip_address)
        if ok and not msg:
            msg = f"IP {ip_address} added to Malicious."
        response(ok, msg)
    else:
        response(False, "IP address not provided.")

elif route == "deleteMaliciousIP":
    if ip_address:
        ok, msg = delete_ip(ip_address)
        if ok and not msg:
            msg = f"IP {ip_address} deleted from Malicious."
        response(ok, msg)
    else:
        response(False, "IP address not provided.")

elif route == "listMaliciousIP":
    ok, msg = show_ips()
    if ok:
        ips = msg.splitlines() if msg else []
        response(True, "Malicious IPs retrieved.", ips if ips else ["No IPs in the Malicious."])
    else:
        response(False, msg)

elif route == "searchMaliciousIP":
    if ip_address:
        ok, msg = search_ip(ip_address)
        if ok and msg:
            response(True, f"IP {ip_address} is in Malicious.", [msg])
        else:
            response(False, f"IP {ip_address} not found in Malicious.")
    else:
        response(False, "IP address not provided.")

else:
    response(False, f"Invalid route: {route}")
