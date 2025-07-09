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

// Function to get the routing table
function getRoutingTable() {
    $output = shell_exec('/usr/bin/netstat -nrfinet 2>&1');
    if (!$output) {
        return [
            'api_status' => 'error',
            'message' => 'Failed to retrieve routing table'
        ];
    }
    
    $routes = [];
    $lines = explode("\n", trim($output));
    $headerPassed = false;
    foreach ($lines as $line) {
        if (!$headerPassed) {
            if (strpos($line, 'Destination') !== false) {
                $headerPassed = true;
            }
            continue;
        }
        
        $columns = preg_split('/\s+/', $line);
        if (count($columns) < 4 || $columns[0] === 'Destination') continue;
        
        $routes[] = [
            'destination' => $columns[0],
            'gateway' => $columns[1],
            'flags' => $columns[2],
            'interface' => $columns[3]
        ];
    }
    
    return [
        'api_status' => 'success',
        'message' => 'Routing table retrieved successfully',
        'routes' => $routes
    ];
}

// Function to get all IP addresses
function getAllIPAddresses() {
    $output = shell_exec('/sbin/ifconfig -a 2>&1');
    if (!$output) {
        return [
            'api_status' => 'error',
            'message' => 'Failed to retrieve IP addresses'
        ];
    }
    
    $ipAddresses = [];
    preg_match_all('/inet\s+([0-9.]+)/', $output, $matches);
    if (!empty($matches[1])) {
        $ipAddresses = array_unique($matches[1]);
    }
    
    return [
        'api_status' => 'success',
        'message' => 'IP addresses retrieved successfully',
        'ip_addresses' => $ipAddresses
    ];
}

$response = [
    'routing_table' => getRoutingTable(),
    'ip_addresses' => getAllIPAddresses()
];

echo json_encode($response, JSON_PRETTY_PRINT);

?>
