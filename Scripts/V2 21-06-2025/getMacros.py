#!/usr/local/bin/python3

import json
import re
import os
import sys

# Step 1: Output correct headers for CGI
print("Content-Type: application/json\n")

API_KEY = '1234567890abcdef'

# Step 2: API Key validation
api_key = os.environ.get('HTTP_X_API_KEY')
if api_key != API_KEY:
    print(json.dumps({
        'api_status': 'error',
        'message': 'Forbidden: Invalid API Key'
    }))
    sys.exit(0)

# Step 3: Get path info (e.g., /getMacros or /hello)
path = os.environ.get('PATH_INFO', '')

# Step 4: Route logic
if path == '/getMacros':
    # Original getMacros logic
    variables = []
    config_path = '/etc/pf-include/macros.conf'
    
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            content = f.read()
            matches = re.findall(r'^([a-zA-Z0-9_]+)=', content, re.MULTILINE)
            if matches:
                variables = list(set(f"${var}" for var in matches))

    print(json.dumps({
        'api_status': 'success',
        'message': 'Variable names retrieved successfully',
        'variables': variables
    }, indent=4))

elif path == '/hello':
    # New /hello endpoint
    print(json.dumps({
        'api_status': 'success',
        'message': 'Hello, World!'
    }, indent=4))

else:
    # Catch-all for unknown routes
    print(json.dumps({
        'api_status': 'error',
        'message': f'Unknown endpoint: {path}'
    }, indent=4))
