<?php

header("Access-Control-Allow-Origin: *"); // Allow all origins (*), or specify your frontend URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY"); // Allow custom headers
header('Content-Type: application/json');

// Handle CORS Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

date_default_timezone_set('UTC');

// List of valid API keys (store securely)
$validApiKeys = [
    "1234567890abcdef",
    "abcdef1234567890"
];

// Get API key from headers
$headers = getallheaders();
$apiKey = $headers['X-API-KEY'] ?? '';

// Check if API key is valid
if (!in_array($apiKey, $validApiKeys)) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied. Invalid API key."]);
    exit;
}

// If API key is valid, return API response
$response = [
    'date' => date('Y-m-d H:i:s'),
    'description' => 'firewall api response'
];

echo json_encode($response);

?>
