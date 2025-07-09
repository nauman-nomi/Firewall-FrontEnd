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
            '$api_status' => 'error',
            '$message' => 'Forbidden: Invalid API Key'
        ]);
        http_response_code(403);
        exit;
    }
}

// Validate API Key before proceeding
validateApiKey();

// Function to extract all variable names from macros.conf
function getVariableNames() {
    $variables = [];
    
    if (file_exists('/etc/pf-include/macros.conf')) {
        $config = file_get_contents('/etc/pf-include/macros.conf');
        
        // Match all variable names
        preg_match_all('/^([a-zA-Z0-9_]+)=/m', $config, $matches);
        
        if (!empty($matches[1])) {
            $variables = array_unique($matches[1]); // Ensure unique variable names
        }
    }
    
    // Add $ sign before each variable
    $variables = array_map(fn($var) => "$$var", $variables);
    
    return $variables;
}

// Retrieve and return variable names
$response = [
    'api_status' => 'success',
    'message' => 'Variable names retrieved successfully',
    'variables' => getVariableNames()
];

echo json_encode($response, JSON_PRETTY_PRINT);

?>
