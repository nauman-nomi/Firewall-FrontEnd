#!/usr/local/bin/python3.11

import json
import os
import re

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


conf_dir = "/usr/local/etc/nginx/conf.d/"
modsec_dir = "/usr/local/etc/nginx/modsec/"
result = []

try:
    for filename in os.listdir(conf_dir):
        if not filename.endswith(".conf"):
            continue
        domain_name = filename.replace(".conf", "")
        conf_path = os.path.join(conf_dir, filename)
        modsec_path = os.path.join(modsec_dir, domain_name.split('.')[0] + ".conf")

        with open(conf_path) as f:
            content = f.read()

        ip_port = ""
        modsec = "OFF"
        web_type = "http"

        listen_match = re.search(r"listen\s+([\d\.]+)(:\d+)?( ssl)?;", content)
        if listen_match:
            ip = listen_match.group(1)
            port = listen_match.group(2) or ":80"
            ip_port = f"{ip}{port}"
            if listen_match.group(3):
                web_type = "https"


        modsec_match = re.search(r"modsecurity\s+(on|off);", content, re.IGNORECASE)
        if modsec_match:
            modsec = modsec_match.group(1).upper()

        ip_whitelist = ""
        method_whitelist = ""

        try:
            with open(modsec_path) as f:
                modsec_content = f.read()

            ip_match = re.search(r'SecRule REMOTE_ADDR "@ipMatch ([^"]+)"', modsec_content)
            if ip_match:
                ip_whitelist = ip_match.group(1)

            method_regex = re.search(r'SecRule REQUEST_METHOD\s+["\']!?@rx\s+\^\((.*?)\)\$["\']', modsec_content)
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
except Exception as e:
    print(json.dumps({
        "api_status": "fail",
        "message": str(e),
        "output": []
    }))