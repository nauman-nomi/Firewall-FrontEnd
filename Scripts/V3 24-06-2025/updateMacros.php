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
if (!isset($data['InternalInterface'], $data['ExternalInterface'], $data['sdWANInterface'], $data['vpnInterface'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    http_response_code(400);
    exit;
}

// Define file path
$configFilePath = '/etc/pf-include/macros.conf';

// Clear existing file content
if (file_put_contents($configFilePath, "") === false) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to clear config file']);
    http_response_code(500);
    exit;
}

// Build configuration content
$configLines = [];

// Internal Interfaces
foreach ($data['InternalInterface'] as $index => $interface) {
    $configLines[] = "int_if{$index}=\"{$interface}\"";
}

// External Interfaces
foreach ($data['ExternalInterface'] as $index => $interface) {
    $configLines[] = "ext_if{$index}=\"{$interface}\"";
}

// sdWAN Interfaces
foreach ($data['sdWANInterface'] as $index => $interface) {
    $configLines[] = "sdwan_if{$index}=\"{$interface}\"";
}

// VPN Interfaces
foreach ($data['vpnInterface'] as $index => $interface) {
    $configLines[] = "vpn_if{$index}=\"{$interface}\"";
}

// Write to file
if (file_put_contents($configFilePath, implode("\n", $configLines) . "\n") === false) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update config file']);
    http_response_code(500);
    exit;
}

// Response success
echo json_encode([
    'status' => 'success',
    'message' => 'Configuration updated successfully',
    'config_path' => $configFilePath
]);
http_response_code(200);

?>
