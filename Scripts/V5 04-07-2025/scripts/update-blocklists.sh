#!/bin/sh

# Directories and Files
BLOCKLIST_DIR="/usr/local/etc/pf-blocklist"
BLOCKLIST_FILE="$BLOCKLIST_DIR/malicious_ips.txt"
TEMP_FILE="$BLOCKLIST_DIR/temp_ips.txt"

# Threat Feeds
FEEDS="
https://feodotracker.abuse.ch/downloads/ipblocklist.txt
https://sslbl.abuse.ch/blacklist/sslipblacklist.txt
https://urlhaus.abuse.ch/downloads/ip_blacklist.txt
https://ransomwaretracker.abuse.ch/downloads/RW_IPBL.txt
https://www.spamhaus.org/drop/drop.txt
https://www.spamhaus.org/drop/edrop.txt
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

