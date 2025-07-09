#!/usr/local/bin/python3.11

import json
import getpass

print("Content-Type: application/json\n")

data = {
    "message": getpass.getuser(),
    "status": "success"
}

print(json.dumps(data))




print("Running as user:", getpass.getuser())
