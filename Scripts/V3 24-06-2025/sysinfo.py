#!/usr/local/bin/python3.11

import subprocess
import json
import os
import sys
import re

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


def run_cmdz(cmd, decode=True):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip() if decode else result.stdout
    except Exception:
        return ""

def parse_sockstat():
    try:
        with open("/tmp/filewrapper_output.txt", "r") as f:
            output = f.read()
    except FileNotFoundError:
        return []

    lines = output.splitlines()
    ports = []
    if len(lines) <= 1:
        return ports

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

def humanize(value):
    if value == "S5":
        return "Soft-Off"
    elif value == "1":
        return "Yes"
    elif value == "0":
        return "No"
    return value  # fallback

def format_power_summary(summary_dict):
    return " <br> ".join(f"{k.replace('_', ' ').title()}: {v}" for k, v in summary_dict.items())

def get_power_consumption():
    output = run_cmd("sysctl -a | grep -i power")
    if output:
        raw_power = output
    else:
        raw_power = run_cmd("sysctl -a | grep -i watt")
 
    summary_power = {
        "power_button_state": re.search(r'hw\.acpi\.power_button_state:\s*(\S+)', raw_power),
        "usb_power_timeout": re.search(r'hw\.usb\.power_timeout:\s*(\d+)', raw_power),
        "power_suspend_enabled": re.search(r'hw\.pci\.do_power_suspend:\s*(\d+)', raw_power),
        "power_resume_enabled": re.search(r'hw\.pci\.do_power_resume:\s*(\d+)', raw_power),
        "efi_poweroff_supported": re.search(r'hw\.efi\.poweroff:\s*(\d+)', raw_power),
    }

    power_summary = {
        k: humanize(m.group(1)) if m else "Unknown"
        for k, m in summary_power.items()
    }
    
    return format_power_summary(power_summary)


run_cmd("sudo /usr/local/bin/sockstat-wrapper.sh")
open_ports = parse_sockstat()

result = {
    "api_status": "success",
    "message": "System information retrieved.",
    "hostname": run_cmd("hostname"),
    "model": run_cmd("sysctl -n hw.model"),
    "serialNumber": run_cmd("dmidecode -s system-serial-number"),
    "cpuTemp": run_cmd("sysctl -a | grep -i temperature | awk -F': ' '{print $2}'"),
    "cores": run_cmd("sysctl -n hw.ncpu"),
    "powerConsumption": get_power_consumption(),
    "interfacesCount": run_cmd("ifconfig -l | wc -w"),
    "failed_login_attempts": run_cmd("grep 'Failed password' /var/log/auth.log | wc -l"),
    "blocked_ip_count": run_cmd("pfctl -t blocked -T show | wc -l"),
    "firewallRules": run_cmd("pfctl -sr | wc -l"),
    "open_ports": open_ports,
    "open_ports_count": str(len(open_ports)),
    "Antivirus Status": run_cmd("service clamav-clamd status"),
    "Firewall Status": run_cmd("/sbin/pfctl -s info"),
    "defaultGateway": run_cmd("netstat -rn | grep '^default'"),
    "dns": run_cmd("cat /etc/resolv.conf | grep nameserver"),
    "open_ports": parse_sockstat(),
    "logged_in_users": parse_who(),
    "top_processes": parse_top_processes()
}

print(json.dumps(result, indent=2))
