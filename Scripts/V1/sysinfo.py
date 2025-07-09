#!/usr/local/bin/python3.11

import subprocess
import json
import os
import sys

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

def run_cmd(cmd, decode=True):
    try:
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.DEVNULL)
        return output.decode().strip() if decode else output
    except Exception as e:
        return ""

def parse_sockstat():
    lines = run_cmd("sockstat -4 -6").splitlines()[1:]  # Skip header
    ports = []
    for line in lines:
        parts = line.split()
        if len(parts) >= 6 and ':' in parts[5]:
            proto = parts[0]
            proc = parts[1]
            port = parts[5].split(':')[-1]
            ports.append({
                "protocol": proto,
                "port": port,
                "process": proc
            })
    return ports

def parse_who():
    lines = run_cmd("who").splitlines()
    users = []
    for line in lines:
        parts = line.split()
        if len(parts) >= 3:
            users.append({
                "username": parts[0],
                "tty": parts[1],
                "login_time": parts[2]
            })
    return users

def parse_top_processes():
    lines = run_cmd("ps -axo pid,comm,%cpu,%mem | sort -k3 -nr | head -n 10").splitlines()[1:]
    processes = []
    for line in lines:
        parts = line.strip().split(None, 3)
        if len(parts) == 4:
            processes.append({
                "pid": parts[0],
                "name": parts[1],
                "cpu_percent": parts[2],
                "memory_percent": parts[3]
            })
    return processes

result = {
    "api_status": "success",
    "message": "System information retrieved.",
    "hostname": run_cmd("hostname"),
    "model": run_cmd("sysctl -n hw.model"),
    "serialNumber": run_cmd("dmidecode -s system-serial-number"),
    "cpuTemp": run_cmd("sysctl -a | grep -i temperature | awk -F': ' '{print $2}'"),
    "cores": run_cmd("sysctl -n hw.ncpu"),
    "powerConsumption": run_cmd("sysctl -a | grep -i watt"),
    "interfacesCount": run_cmd("ifconfig -l | wc -w"),
    "failed_login_attempts": run_cmd("grep 'Failed password' /var/log/auth.log | wc -l"),
    "blocked_ip_count": run_cmd("pfctl -t blocked -T show | wc -l"),
    "firewallRules": run_cmd("pfctl -sr | wc -l"),
    "open_ports_count": run_cmd("sockstat -4 -l | wc -l"),
    "Antivirus Status": run_cmd("service clamav-clamd status"),
    "Firewall Status": run_cmd("/sbin/pfctl -s info"),
    "defaultGateway": run_cmd("netstat -rn | grep '^default'"),
    "dns": run_cmd("cat /etc/resolv.conf | grep nameserver"),
    "open_ports": parse_sockstat(),
    "logged_in_users": parse_who(),
    "top_processes": parse_top_processes()
}

print(json.dumps(result, indent=2))
