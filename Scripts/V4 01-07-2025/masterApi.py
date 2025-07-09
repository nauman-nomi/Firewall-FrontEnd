#!/usr/local/bin/python3.11

import os
import sys
import json
import re
import subprocess
import cgi

# ------------------ Config ------------------
API_KEY = '1234567890abcdef'
BLOCKLIST_FILE = '/usr/local/etc/pf-blocklist/malicious_ips.txt'
QUEUE_CONF_FILE = '/etc/pf-include/queues_def.conf'
SCRIPT_PATH = 'scripts/update-blocklists.sh'

# ------------------ Helpers ------------------

def print_headers():
    print("Content-Type: application/json")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY")
    print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    print()

def json_response(data, status=0):
    print(json.dumps(data, indent=4))
    sys.exit(status)

def validate_api_key():
    key = os.environ.get('HTTP_X_API_KEY')
    if key != API_KEY:
        json_response({'api_status': 'error', 'message': 'Forbidden: Invalid API Key'})

# ------------------ Endpoint Handlers ------------------

def handle_update_ip_status():
    form = cgi.FieldStorage()
    ip = form.getvalue('ip')
    status = form.getvalue('status')

    if not ip or status not in ['active', 'inactive']:
        return json_response({'api_status': 'error', 'message': 'Invalid input. Provide "ip" and "status".'})

    if not os.path.exists(BLOCKLIST_FILE):
        return json_response({'api_status': 'error', 'message': 'Blocklist file not found'})

    updated = False
    updated_lines = []

    with open(BLOCKLIST_FILE, 'r') as f:
        lines = f.readlines()

    for line in lines:
        stripped_line = line.strip()
        current_ip = stripped_line.lstrip('#').strip().split()[0]

        if current_ip == ip.strip():
            updated = True
            if status == 'active':
                updated_lines.append(f"{ip.strip()}\n")  # uncomment to activate
            else:  # status == 'inactive'
                updated_lines.append(f"#{ip.strip()}\n")  # comment to deactivate
        else:
            updated_lines.append(line)

    with open(BLOCKLIST_FILE, 'w') as f:
        f.writelines(updated_lines)

    if updated:
        return json_response({'api_status': 'success', 'message': f'IP {ip} status updated to {status}'})
    else:
        return json_response({'api_status': 'error', 'message': f'IP {ip} not found in the blocklist'})

def handle_update_malware_script():
    if not os.path.exists(SCRIPT_PATH):
        print(json.dumps({
            'api_status': 'error',
            'message': f'Script not found: {SCRIPT_PATH}'
        }, indent=4))
        sys.exit(0)

    try:
        result = subprocess.run(
            ["/bin/sh", SCRIPT_PATH],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode == 0:
            print(json.dumps({
                'api_status': 'success',
                'message': 'Script executed successfully',
                'output': result.stdout.strip()
            }, indent=4))
        else:
            print(json.dumps({
                'api_status': 'error',
                'message': 'Script execution failed',
                'error_output': result.stderr.strip()
            }, indent=4))

    except Exception as e:
        print(json.dumps({
            'api_status': 'error',
            'message': f'Exception occurred: {str(e)}'
        }, indent=4))


def handle_get_malicious_files():
    if not os.path.exists(BLOCKLIST_FILE):
        json_response({'api_status': 'error', 'message': 'Blocklist file not found'})
        return  # Important to prevent further execution

    with open(BLOCKLIST_FILE, 'r') as f:
        lines = [line.strip() for i, line in enumerate(f) if i > 0 and line.strip()]

    blocked_ips = []
    commented_count = 0
    uncommented_count = 0

    for line in lines:
        if line.startswith('#'):
            commented_count += 1
            status = 'inactive'
            ip = line.lstrip('#').strip()
        else:
            uncommented_count += 1
            status = 'active'
            ip = line.strip()

        blocked_ips.append({'ip': ip, 'status': status})

    json_response({
        'api_status': 'success',
        'message': 'Malicious IP blocklist retrieved',
        'entries': uncommented_count + commented_count,  # matches your original logic
        'blockedIps': blocked_ips,
        'commentedCount': commented_count,
        'uncommentedCount': uncommented_count
    })

def handle_get_auth_log():
    log_file = '/var/log/auth.log'
    num_lines = 50  # Change this if needed

    if not os.path.exists(log_file):
        json_response({'api_status': 'error', 'message': 'Log file not found'})

    try:
        with open(log_file, 'r') as f:
            lines = f.readlines()[-num_lines:]
    except Exception as e:
        json_response({'api_status': 'error', 'message': f'Failed to read log: {str(e)}'})

    json_response({
        'api_status': 'success',
        'message': f'Last {num_lines} log lines',
        'logs': lines
    })


# ------------------ Main Entry Point ------------------

print_headers()

if os.environ.get('REQUEST_METHOD') == 'OPTIONS':
    sys.exit(0)

validate_api_key()
path = os.environ.get('PATH_INFO', '')

if path == '/updateMalwareFile':
    handle_update_malware_script()
elif path == '/maliciousFiles':
    handle_get_malicious_files()
elif path == '/UpdateMalwareIPStatus':
    handle_update_ip_status()
elif path == '/logs':
    handle_get_auth_log()
elif path == '/hello':
    print("hello")
else:
    json_response({'api_status': 'error', 'message': f'Unknown endpoint: {path}'})
