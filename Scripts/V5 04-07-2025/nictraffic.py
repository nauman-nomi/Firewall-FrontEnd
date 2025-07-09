#!/usr/local/bin/python3.11

import subprocess
import json
import time
import cgitb

cgitb.enable()
print("Content-Type: application/json\n")

def get_interfaces():
    try:
        result = subprocess.run(["ifconfig", "-l"], capture_output=True, text=True, timeout=2)
        interfaces = result.stdout.strip().split()
        return [iface for iface in interfaces if iface != "lo0"]
    except Exception:
        return []

def get_traffic(interface):
    try:
        # Run for very short duration to avoid blocking
        result = subprocess.run(
            ["/usr/local/bin/ifstat", "-i", interface, "0.1", "1"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=2
        )

        lines = result.stdout.strip().splitlines()
        if len(lines) >= 3:
            values = lines[2].split()
            rx_kbps = float(values[0])
            tx_kbps = float(values[1])
            return {
                "name": interface,
                "rx_bytes_per_sec": int(rx_kbps * 1024),
                "tx_bytes_per_sec": int(tx_kbps * 1024)
            }
        else:
            return None
    except Exception:
        return None

def main():
    interfaces = get_interfaces()
    output = []

    for iface in interfaces:
        data = get_traffic(iface)
        if data:
            output.append(data)

    if output:
        print(json.dumps({
            "api_status": "success",
            "message": "Network traffic speeds collected successfully",
            "interfaces": output
        }))
    else:
        print(json.dumps({
            "api_status": "fail",
            "message": "No valid interface data collected.",
            "interfaces": []
        }))

main()
