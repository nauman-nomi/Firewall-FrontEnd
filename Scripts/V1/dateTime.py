#!/usr/local/bin/python3.11
import os
import subprocess
import datetime
import json
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

try:
    # Run the FreeBSD date command
    result = subprocess.run(['date', '+%Y-%m-%d %H:%M:%S'], capture_output=True, text=True)

    if result.returncode != 0:
        response = {
            "api_status": "fail",
            "message": result.stderr.strip(),
            "dateTime": ""
        }
    else:
        raw_output = result.stdout.strip()
        dt_obj = datetime.datetime.strptime(raw_output, "%Y-%m-%d %H:%M:%S")
        formatted = dt_obj.strftime("%d/%m/%Y, %I:%M:%S %p")

        response = {
            "api_status": "success",
            "message": "? Date fetched successfully.",
            "dateTime": formatted
        }

except Exception as e:
    response = {
        "api_status": "fail",
        "message": str(e),
        "dateTime": ""
    }

print(json.dumps(response))