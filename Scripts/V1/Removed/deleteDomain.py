#!/usr/local/bin/python3.11
# -*- coding: utf-8 -*-

import sys
import os
import json
import cgitb

# Enable full error display in browser (for CGI)
cgitb.enable()

try:
    # Must print this FIRST — valid HTTP header for JSON
    print("Content-Type: application/json\n")

    # Get POST content length
    content_length = int(os.environ.get('CONTENT_LENGTH', 0))
    if content_length == 0:
        raise Exception("No POST data received")

    # Read and parse JSON
    post_data = sys.stdin.read(content_length)
    data = json.loads(post_data)

    domain = data.get('domainName')
    if not domain:
        raise Exception("Missing 'domainName' in POST data")

    # File paths to delete
    base_path = "/usr/local/etc/nginx/"
    conf_d = f"{base_path}conf.d/{domain}.conf"
    modsec = f"{base_path}modsec/{domain.split('.')[0]}.conf"
    cert_crt = f"/usr/local/etc/certificate/{domain}.crt"
    cert_key = f"/usr/local/etc/certificate/{domain}.key"

    files_to_delete = [conf_d, modsec, cert_crt, cert_key]
    deleted_files = []

    for path in files_to_delete:
        if os.path.exists(path):
            os.remove(path)
            deleted_files.append(path)

    # Restart Nginx
    os.system("service nginx restart")

    print(json.dumps({
        "api_status": "success",
        "message": "Files deleted and Nginx restarted.",
        "deleted_files": deleted_files
    }))

except Exception as e:
    # Must print header here too if not already printed
    print(json.dumps({
        "api_status": "fail",
        "message": str(e),
        "deleted_files": []
    }))
