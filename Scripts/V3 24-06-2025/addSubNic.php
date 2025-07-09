<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
            'status' => 'error',
            'message' => 'Forbidden: Invalid API Key'
        ]);
        http_response_code(403);
        exit;
    }
}

// Validate API Key before proceeding
validateApiKey();

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate required parameters
if (!isset($data['nic_name'], $data['ip_address'], $data['subnet_mask'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    http_response_code(400);
    exit;
}

$nicName = escapeshellarg($data['nic_name']);
$ipAddress = escapeshellarg($data['ip_address']);
$subnetMask = escapeshellarg($data['subnet_mask']);

// Read existing /etc/rc.conf content
$rcConfPath = '/etc/rc.conf';
if (!file_exists($rcConfPath)) {
    echo json_encode(['status' => 'error', 'message' => 'rc.conf file not found']);
    http_response_code(500);
    exit;
}
$rcConf = file($rcConfPath, FILE_IGNORE_NEW_LINES);

// Find the last alias index for the given interface
$lastAliasIndex = -1;
foreach ($rcConf as $line) {
    if (preg_match("/ifconfig_" . preg_quote($data['nic_name']) . "_alias(\d+)/", $line, $matches)) {
        $lastAliasIndex = max($lastAliasIndex, (int)$matches[1]);
    }
}
$newAliasIndex = $lastAliasIndex + 1;
$newAliasLine = "ifconfig_{$data['nic_name']}_alias{$newAliasIndex}=\"inet {$data['ip_address']} netmask {$data['subnet_mask']}\"";

// Insert new alias line at the correct position
$inserted = false;
$newRcConf = [];
foreach ($rcConf as $line) {
    $newRcConf[] = $line;
    if (preg_match("/^ifconfig_" . preg_quote($data['nic_name']) . "\s*=.*$/", $line) && !$inserted) {
        $newRcConf[] = $newAliasLine;
        $inserted = true;
    }
}
if (!$inserted) {
    $newRcConf[] = $newAliasLine;
}

// Write back to rc.conf
if (file_put_contents($rcConfPath, implode("\n", $newRcConf) . "\n") === false) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update rc.conf']);
    http_response_code(500);
    exit;
}

// Restart network and routing services
$restart_command = "/usr/local/bin/sudo /usr/sbin/service netif restart && /usr/local/bin/sudo /usr/sbin/service routing restart 2>&1";
$output = shell_exec($restart_command);

// Response success
echo json_encode([
    'status' => 'success',
    'message' => 'Alias added successfully and network restarted',
    'new_alias' => "{$data['nic_name']}_alias{$newAliasIndex}",
    'restart_output' => trim($output)
]);
http_response_code(200);

?>
