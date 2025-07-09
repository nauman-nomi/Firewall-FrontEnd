<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY");
header('Content-Type: application/json');

date_default_timezone_set('UTC');

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Define your API key (store securely in a real application)
define('API_KEY', '1234567890abcdef');

// Function to validate API key
function validateApiKey() {
    $headers = getallheaders();
    if (!isset($headers['X-API-KEY']) || $headers['X-API-KEY'] !== API_KEY) {
        echo json_encode([
            'api_status' => 'error',
            'message' => 'Forbidden: Invalid API Key'
        ]);
        http_response_code(403);
        exit;
    }
}

// Validate API Key before proceeding
validateApiKey();

// Function to read multiple interface mappings from /etc/pf-include/macros.conf
function getInterfaceMappings() {
    $externalIfs = [];
    $internalIfs = [];
    $sdwanIfs = [];
    $vpnIfs = [];

    if (file_exists('/etc/pf-include/macros.conf')) {
        $config = file_get_contents('/etc/pf-include/macros.conf');

        // Match all external interfaces with numbers
        preg_match_all('/ext_if(\d*)="([^"]+)"/', $config, $extMatches);
        if (!empty($extMatches[1]) && !empty($extMatches[2])) {
            foreach ($extMatches[1] as $index => $num) {
                $externalIfs[] = ($num === '') ? "0 ,{$extMatches[2][$index]}" : "$num,{$extMatches[2][$index]}";
            }
        }

        // Match all internal interfaces with numbers
        preg_match_all('/int_if(\d*)="([^"]+)"/', $config, $intMatches);
        if (!empty($intMatches[1]) && !empty($intMatches[2])) {
            foreach ($intMatches[1] as $index => $num) {
                $internalIfs[] = ($num === '') ? "0 ,{$intMatches[2][$index]}" : "$num,{$intMatches[2][$index]}";
            }
        }

        // Match all SD-WAN interfaces with numbers
        preg_match_all('/sdwan_if(\d*)="([^"]+)"/', $config, $sdwanMatches);
        if (!empty($sdwanMatches[1]) && !empty($sdwanMatches[2])) {
            foreach ($sdwanMatches[1] as $index => $num) {
                $sdwanIfs[] = ($num === '') ? "0 ,{$sdwanMatches[2][$index]}" : "$num,{$sdwanMatches[2][$index]}";
            }
        }

        // Match all VPN interfaces with numbers
        preg_match_all('/vpn_if(\d*)="([^"]+)"/', $config, $vpnMatches);
        if (!empty($vpnMatches[1]) && !empty($vpnMatches[2])) {
            foreach ($vpnMatches[1] as $index => $num) {
                $vpnIfs[] = ($num === '') ? "0 ,{$vpnMatches[2][$index]}" : "$num,{$vpnMatches[2][$index]}";
            }
        }
    }

    return [$externalIfs, $internalIfs, $sdwanIfs, $vpnIfs];
}

list($externalIfs, $internalIfs, $sdwanIfs, $vpnIfs) = getInterfaceMappings();

// Function to extract alias names from rc.conf
function getAliasesFromRCConf() {
    $aliases = [];
    if (file_exists('/etc/rc.conf')) {
        $config = file_get_contents('/etc/rc.conf');
        preg_match_all('/ifconfig_([a-zA-Z0-9]+)_alias(\d+)="inet ([0-9.]+) netmask ([0-9.]+)"/', $config, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $aliases[$match[1]][] = [
                'alias_name' => $match[1] . '_alias' . $match[2],
                'ip_address' => $match[3],
                'subnet_mask' => $match[4]
            ];
        }
    }
    return $aliases;
}

$aliases = getAliasesFromRCConf();

// Function to extract network interfaces and statistics
function getNetworkInterfaces($externalIfs, $internalIfs, $aliases, $sdwanIfs, $vpnIfs) {
    $interfaces = [];
    $nicCount = 0;
    $subInterfaceCount = 0;
    $vlanCount = 0;
    $internalCount = 0;
    $externalCount = 0;

    // Get the raw ifconfig output
    $output = shell_exec('/sbin/ifconfig -a 2>&1');
    if (!$output) {
        return [
            'api_status' => 'error',
            'message' => 'Failed to execute ifconfig command'
        ];
    }

    // Split the output into blocks for each interface
    $blocks = preg_split('/(?=^[^\s]+:)/m', $output, -1, PREG_SPLIT_NO_EMPTY);

    // Retrieve the system default gateway
    $gateway = trim(shell_exec("/sbin/route -n get default | awk '/gateway/ {print $2}' 2>/dev/null")) ?: 'N/A';

    foreach ($blocks as $block) {
        if (!preg_match('/^([^\s:]+)(:\S*)?:/', $block, $matches)) {
            continue;
        }

        $nicName = trim($matches[1]);
        if ($nicName === 'lo0') {
            continue;
        }

        // Determine NIC type
        $nicType = 'Unknown';

        // $extractedInternalIfs = array_map(function($item) {
        //     $parts = explode(',', $item);
        //     return trim($parts[1]); // Get the part after the comma
        // }, $internalIfs);

        if (in_array($nicName, array_map(function($item) {$parts = explode(',', $item); return trim($parts[1]);}, $internalIfs))) {
            $nicType = 'Internal';
            $internalCount++;
        } elseif (in_array($nicName, array_map(function($item) {$parts = explode(',', $item); return trim($parts[1]);}, $externalIfs))) {
            $nicType = 'External';
            $externalCount++;
        }

        // Count VLANs
        if (preg_match('/vlan/', $nicName)) {
            $vlanCount++;
        }

        // Extract IP and subnet mask
        preg_match('/inet\s+([0-9.]+)\s+netmask\s+([0-9xa-fA-F]+)/', $block, $ipMatches);
        $ipAddress = isset($ipMatches[1]) ? $ipMatches[1] : 'N/A';
        $subnetMask = isset($ipMatches[2]) ? long2ip(hexdec($ipMatches[2])) : 'N/A';

        // Extract MAC address
        $macAddress = 'N/A';
        if (preg_match('/ether\s+([0-9a-fA-F:]+)/', $block, $macMatches)) {
            $macAddress = $macMatches[1];
        }

        // Determine link state
        $linkState = strpos($block, 'status: active') !== false ? 'up' : 'down';

        // Store primary interface
        $interfaces[] = [
            'nic_name' => $nicName,
            'nic_type' => $nicType,
            'category' => 'master_nic',
            'ip_address' => $ipAddress,
            'subnet_mask' => $subnetMask,
            'link_state' => $linkState,
            'mac_address' => $macAddress
        ];

        // Store aliases from rc.conf if available
        if (isset($aliases[$nicName])) {
            foreach ($aliases[$nicName] as $alias) {
                $interfaces[] = [
                    'nic_name' => $alias['alias_name'],
                    'nic_type' => $nicType,
                    'category' => 'sub_nic',
                    'ip_address' => $alias['ip_address'],
                    'subnet_mask' => $alias['subnet_mask'],
                    'link_state' => $linkState,
                    'mac_address' => $macAddress
                ];
                $subInterfaceCount++;
            }
        }

        $nicCount++;
    }

    return [
        'api_status' => 'success',
        'message' => 'Network interfaces retrieved successfully',
        'nic_count' => $nicCount,
        'sub_interface_count' => $subInterfaceCount,
        'total_vlan_count' => $vlanCount,
        'total_internal' => $internalCount,
        'total_external' => $externalCount,
        'default_gateway' => $gateway,
        'interfaces' => $interfaces,
        'external_interfaces' => $externalIfs,
        'internal_interfaces' => $internalIfs,
        'sdwan_interfaces' => $sdwanIfs,
        'vpn_interfaces' => $vpnIfs
    ];
}

// Output the network interface information as JSON
echo json_encode(getNetworkInterfaces($externalIfs, $internalIfs, $aliases,  $sdwanIfs, $vpnIfs), JSON_PRETTY_PRINT);

?>
