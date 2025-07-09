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
function validateApiKey($providedKey) {
    if ($providedKey !== API_KEY) {
        echo json_encode([
            'api_status' => 'error',
            'message' => 'Forbidden: Invalid API Key'
        ]);
        http_response_code(403);
        exit;
    }
}

// Read JSON input
$inputData = json_decode(file_get_contents("php://input"), true);

// Validate API Key
if (!isset($inputData['api_key'])) {
    echo json_encode(["api_status" => "error", "message" => "API Key missing"]);
    http_response_code(400);
    exit;
}
validateApiKey($inputData['api_key']);

// File path
$filePath = "/etc/pf-include/options.conf";

// Function to format data into file structure
function formatConfigData($data) {
    $configLines = [];

    // Block Policy
    if (!empty($data['blockPolicy'])) {
        $configLines[] = "set block-policy " . $data['blockPolicy'];
    }

    // Log Interfaces (Multiple Entries)
    if (!empty($data['logInterface']) && is_array($data['logInterface'])) {
        foreach ($data['logInterface'] as $interface) {
            $configLines[] = "set loginterface " . $interface;
        }
    }

    // Optimization
    if (!empty($data['optimization'])) {
        $configLines[] = "set optimization " . $data['optimization'];
    }

    // Ruleset Optimization
    if (!empty($data['rulesetOptimization'])) {
        $configLines[] = "set ruleset-optimization " . $data['rulesetOptimization'];
    }

    // Limit Settings with Correct Keys
    if (!empty($data['limits']) && is_array($data['limits'])) {
        $limitMappings = [
            'srcNodes' => 'src-nodes',
            'tableEntries' => 'table-entries'
        ];
        $limitEntries = [];
        foreach ($data['limits'] as $key => $value) {
            $formattedKey = $limitMappings[$key] ?? strtolower($key);
            $limitEntries[] = $formattedKey . " " . $value;
        }
        $configLines[] = "set limit { " . implode(", ", $limitEntries) . " }";
    }

    // Skip on Interfaces (Multiple Entries)
    if (!empty($data['skipOnLo'])) {
        $configLines[] = "set skip on lo";
    }

    // Debug
    if (!empty($data['debug'])) {
        $configLines[] = "set debug " . $data['debug'];
    }

    // Fingerprints
    if (!empty($data['fingerprints'])) {
        $configLines[] = 'set fingerprints "/etc/pf.os"';
    }

    // State Policy
    if (!empty($data['statePolicy'])) {
        $configLines[] = "set state-policy " . $data['statePolicy'];
    }

    // Require Order
    if (!empty($data['requireOrder'])) {
        $configLines[] = "set require-order " . $data['requireOrder'];
    }

    // Syncookies
    if (!empty($data['syncookies'])) {
        $configLines[] = "set syncookies " . $data['syncookies'];
    }

    // Timeout Settings with Correct Keys
    if (!empty($data['timeouts']) && is_array($data['timeouts'])) {
        $timeoutMappings = [
            'tcpFirst' => 'tcp.first',
            'tcpOpening' => 'tcp.opening',
            'tcpEstablished' => 'tcp.established',
            'tcpClosing' => 'tcp.closing',
            'tcpFinwait' => 'tcp.finwait',
            'tcpClosed' => 'tcp.closed',
            'udpFirst' => 'udp.first',
            'udpSingle' => 'udp.single',
            'icmpFirst' => 'icmp.first',
            'icmpError' => 'icmp.error'
        ];
        $timeoutEntries = [];
        foreach ($data['timeouts'] as $key => $value) {
            $formattedKey = $timeoutMappings[$key] ?? strtolower($key);
            $timeoutEntries[] = $formattedKey . " " . $value;
        }
        $configLines[] = "set timeout { " . implode(", ", $timeoutEntries) . " }";
    }

    return implode("\n", $configLines) . "\n";
}

// **Clear the file first if it is not empty**
if (file_exists($filePath) && filesize($filePath) > 0) {
    file_put_contents($filePath, ""); // Empty the file
}

// Format data for file writing
$configContent = formatConfigData($inputData);

// Attempt to write to file
if (file_put_contents($filePath, $configContent) !== false) {
    echo json_encode([
        "api_status" => "success",
        "message" => "Configuration saved successfully",
        "file_path" => $filePath
    ]);
} else {
    echo json_encode([
        "api_status" => "error",
        "message" => "Failed to write configuration"
    ]);
    http_response_code(500);
}

?>
