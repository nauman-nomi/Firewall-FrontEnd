#!/usr/local/bin/python3.11

import subprocess
import json
import re
import cgitb
import os

cgitb.enable()


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




def run_cmd(cmd):
    try:
        output = subprocess.check_output(cmd, shell=True, text=True).strip()
        return output
    except subprocess.CalledProcessError:
        return ""

def parse_mem_usage():
    output = run_cmd("top -d1 | grep Mem")
    match = re.findall(r'(\d+[A-Z]?)\s+(\w+)', output)
    usage = {k.lower(): v for v, k in match}
    return {
        "used": usage.get("used", ""),
        "free": usage.get("free", ""),
        "cache": usage.get("cache", ""),
        "inactive": usage.get("inactive", "")
    }

def parse_storage_usage():
    output = run_cmd("df -h")
    lines = output.splitlines()[1:]
    for line in lines:
        parts = line.split()
        if len(parts) >= 6 and parts[5] == "/":
            return {
                "filesystem": parts[0],
                "size": parts[1],
                "used": parts[2],
                "avail": parts[3],
                "capacity": parts[4],
                "mountpoint": parts[5]
            }
    return {
        "filesystem": "",
        "size": "",
        "used": "",
        "avail": "",
        "capacity": "",
        "mountpoint": "",
        "message": "Root filesystem '/' not found"
    }

def parse_storage_usage_old():
    output = run_cmd("df -h")
    lines = output.splitlines()[1:]
    usage = []
    for line in lines:
        parts = line.split()
        if len(parts) >= 6:
            usage.append({
                "filesystem": parts[0],
                "size": parts[1],
                "used": parts[2],
                "avail": parts[3],
                "capacity": parts[4],
                "mountpoint": parts[5]
            })
    return usage

def parse_cpu_usage():
    output = run_cmd("top -n 1 | grep 'CPU:'")
    match = re.search(r'(\d+\.\d+)%\s+user,\s+(\d+\.\d+)%\s+nice,\s+(\d+\.\d+)%\s+system.*?(\d+\.\d+)%\s+idle', output)
    if match:
        return {
            "user": match.group(1),
            "nice": match.group(2),
            "system": match.group(3),
            "idle": match.group(4)
        }
    return {
        "user": "0.0",
        "nice": "0.0",
        "system": "0.0",
        "idle": "100.0"
    }


def parse_packet_stats():
    accepted = []
    dropped = []
    intf_data = run_cmd("netstat -i").splitlines()[1:]
    for line in intf_data:
        parts = line.split()
        if len(parts) >= 5:
            accepted.append(int(parts[3]) if parts[3].isdigit() else 0)
            dropped.append(int(parts[4]) if parts[4].isdigit() else 0)
    return sum(accepted), sum(dropped)


ram_usage = parse_mem_usage()
total_ram = run_cmd("sysctl -n hw.physmem")
total_ram_gb = f"{int(total_ram) / 1024 / 1024 / 1024:.2f} GB" if total_ram.isdigit() else ""
storage_usage = parse_storage_usage()
total_processors = run_cmd("sysctl -n hw.ncpu")
cpu_usage = parse_cpu_usage()
fan_speed_output = run_cmd("sysctl -a | grep fan") or run_cmd("mbmon -c 1")
fan_speed_match = re.search(r'fan\d?:\s*(\d+)\s*rpm', fan_speed_output, re.IGNORECASE)
fan_speed = fan_speed_match.group(1) + " rpm" if fan_speed_match else "N/A"
accepted_packets, dropped_packets = parse_packet_stats()

response = {
    "api_status": "success",
    "message": "System metrics collected successfully.",
    "ram_usage": ram_usage,
    "total_ram": total_ram_gb,
    "storage_usage": storage_usage,
    # "total_storage": run_cmd("sysctl -a | grep geom | grep mediasize"),
    "total_storage": run_cmd("gpart show | grep -E '^=> ' | awk '{sum += $2} END {printf \"%.2f GB\", sum/1024/1024/2}'"),
    "total_processors": total_processors,
    "cpu_usage": cpu_usage,
    "fan_speed_rpm": fan_speed,
    "accepted_packets": accepted_packets,
    "dropped_packets": dropped_packets
}

print(json.dumps(response, indent=2))
