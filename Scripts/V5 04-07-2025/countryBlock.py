#!/usr/local/bin/python3.11

import os
import json
import cgi
import cgitb

cgitb.enable()

# Preflight request for CORS
if os.environ.get("REQUEST_METHOD", "") == "OPTIONS":
    print("Content-Type: application/json")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    print("Access-Control-Allow-Headers: Content-Type, Authorization")
    print("")
    exit()

print("Content-Type: application/json")
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
print("Access-Control-Allow-Headers: Content-Type, Authorization")
print("")

BLOCK_SCRIPT_PATH = "/usr/local/bin/block_maxmind_countries.sh"

def read_countries():
    try:
        with open(BLOCK_SCRIPT_PATH, "r") as f:
            for line in f:
                if line.strip().startswith("COUNTRIES="):
                    return line.strip().split("=")[1].strip('"').split()
        return []
    except Exception as e:
        return []

def update_country_list(countries):
    try:
        updated = False
        with open(BLOCK_SCRIPT_PATH, "r") as f:
            lines = f.readlines()

        for i, line in enumerate(lines):
            if line.strip().startswith("COUNTRIES="):
                lines[i] = f'COUNTRIES="{countries}"\n'
                updated = True
                break

        if not updated:
            return False, "COUNTRIES line not found."

        with open(BLOCK_SCRIPT_PATH, "w") as f:
            f.writelines(lines)

        return True, "Updated successfully"
    except Exception as e:
        return False, str(e)

def run_block_script():
    try:
        # Only works if www user has permission:
        result = os.system(f"/usr/local/bin/doas /bin/sh {BLOCK_SCRIPT_PATH}")
        return result == 0
    except Exception:
        return False

form = cgi.FieldStorage()
path_info = os.environ.get("PATH_INFO", "").lower()
input_countries = form.getfirst("countries", "").strip()
response = {"success": False, "message": "Invalid action"}

if "/view" in path_info:
    countries = read_countries()
    response = {"success": True, "data": countries, "message": "Country list fetched"}

elif "/add" in path_info:
    if input_countries:
        current = set(read_countries())
        new = set(input_countries.split())
        updated_list = " ".join(sorted(current.union(new)))
        ok, msg = update_country_list(updated_list)
        script_ok = run_block_script()
        if ok:
            response = {
                "success": True,
                "data": updated_list,
                "message": "Countries updated successfully" + ("" if script_ok else ", Verify")
            }
        else:
            response = {"success": False, "message": f"Update failed: {msg}"}
    else:
        response = {"success": False, "message": "No countries provided for add."}

elif "/delete" in path_info:
    if input_countries:
        current = set(read_countries())
        target = input_countries.strip()
        if target in current:
            current.remove(target)
            updated_list = " ".join(sorted(current))
            ok, msg = update_country_list(updated_list)
            script_ok = run_block_script()
            if ok:
                response = {
                    "success": True,
                    "data": updated_list,
                    "message": f"{target} removed successfully" + ("" if script_ok else ", verify")
                }
            else:
                response = {"success": False, "message": f"Update failed: {msg}"}
        else:
            response = {"success": False, "message": f"{target} not found in list."}
    else:
        response = {"success": False, "message": "No country code provided for delete."}

print(json.dumps(response))
