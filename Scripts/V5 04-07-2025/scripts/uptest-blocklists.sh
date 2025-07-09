#!/bin/sh

# Directories and Files
BLOCKLIST_DIR="/usr/local/etc/pf-blocklist"
BLOCKLIST_FILE="$BLOCKLIST_DIR/malicious_ips.txt"
TEMP_FILE="$BLOCKLIST_DIR/temp_ips.txt"

# Threat Feeds
FEEDS="
https://www.spamhaus.org/drop/drop.txt
https://www.spamhaus.org/drop/edrop.txt
https://urlhaus.abuse.ch/downloads/ip_blacklist.txt
https://sslbl.abuse.ch/blacklist/sslipblacklist.txt
https://rules.emergingthreats.net/blockrules/compromised-ips.txt
https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset
https://cinsscore.com/list/ci-badguys.txt  
https://www.projecthoneypot.org/list_of_ips.php?t=d  
"

# Fetch feeds and merge into a temp file
echo "# Threat IP Blocklist - $(date)" > "$TEMP_FILE"
for URL in $FEEDS; do
    fetch -o - "$URL" 2>/dev/null | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' >> "$TEMP_FILE"
done

# Remove duplicates and save to final blocklist
sort -u "$TEMP_FILE" > "$BLOCKLIST_FILE"

# Reload PF table
pfctl -t malicious_ips -T replace -f "$BLOCKLIST_FILE"

echo "Updated PF blocklist successfully! Entries: $(wc -l < "$BLOCKLIST_FILE")"

# Cleanup
rm -f "$TEMP_FILE"

