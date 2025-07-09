#!/usr/local/bin/python3.11

import subprocess
import json
import os

print("Content-Type: application/json")
print("Access-Control-Allow-Origin: *")
print()

OUTPUT_FILE = "/tmp/sockstat_output.txt"
ERROR_FILE = "/tmp/sockstat_error.txt"

# Step 1: Run the wrapper
try:
    subprocess.run("sudo /usr/local/bin/sockstat-wrapper.sh", shell=True, check=True)
except subprocess.CalledProcessError as e:
    error_message = f"Failed to run wrapper: {e}"
    if os.path.exists(ERROR_FILE):
        with open(ERROR_FILE, "r") as ef:
            error_message += "\nDetails:\n" + ef.read().strip()
    print(json.dumps({"error": error_message}))
    exit(1)

# Step 2: Read and parse output
if not os.path.exists(OUTPUT_FILE):
    print(json.dumps({"error": f"Output file not found: {OUTPUT_FILE}"}))
    exit(1)

try:
    with open(OUTPUT_FILE, "r") as f:
        lines = f.readlines()
except Exception as e:
    print(json.dumps({"error": f"Failed to read output file: {e}"}))
    exit(1)

ports = []
for line in lines[1:]:  # Skip header
    parts = line.split()
    if len(parts) >= 6:
        ports.append({
            "user": parts[0],
            "command": parts[1],
            "pid": parts[2],
            "protocol": parts[4],
            "local_address": parts[5],
            "foreign_address": parts[6] if len(parts) > 6 else "*:*"
        })  # <-- This closing brace was missing