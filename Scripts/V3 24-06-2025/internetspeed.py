#!/usr/local/bin/python3.11

import subprocess
import json
import cgitb

cgitb.enable()
print("Content-Type: application/json\n")

def get_speedtest_results():
    try:
        result = subprocess.run(
            ["/usr/local/bin/speedtest-cli", "--simple"],  # Use full path
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=15
        )

        if result.returncode != 0:
            return {
                "api_status": "fail",
                "message": result.stderr.strip(),
                "ping": "",
                "download": "",
                "upload": ""
            }

        ping = download = upload = ""

        for line in result.stdout.splitlines():
            if line.startswith("Ping:"):
                ping = line.split(":")[1].strip()
            elif line.startswith("Download:"):
                download = line.split(":")[1].strip()
            elif line.startswith("Upload:"):
                upload = line.split(":")[1].strip()

        return {
            "api_status": "success",
            "message": "Speedtest completed.",
            "ping": ping,
            "download": download,
            "upload": upload
        }

    except subprocess.TimeoutExpired:
        return {
            "api_status": "fail",
            "message": "Speedtest timed out.",
            "ping": "",
            "download": "",
            "upload": ""
        }
    except Exception as e:
        return {
            "api_status": "fail",
            "message": f"Exception: {e}",
            "ping": "",
            "download": "",
            "upload": ""
        }

print(json.dumps(get_speedtest_results()))
