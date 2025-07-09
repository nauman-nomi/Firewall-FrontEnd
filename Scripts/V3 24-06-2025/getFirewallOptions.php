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

// Function to parse options.conf
function parseOptionsConfig() {
    $configData = [
        'loginterface' => [],
        'skip' => [],
        'limit' => [],
        'timeout' => [],
        'other_settings' => []
    ];
    
    if (file_exists('/etc/pf-include/options.conf')) {
        $config = file_get_contents('/etc/pf-include/options.conf');
        $lines = explode("\n", $config);
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, 'set ') !== 0) {
                continue; // Ignore empty lines and non-'set' lines
            }
            
            $line = substr($line, 4); // Remove 'set '
            
            if (preg_match('/^loginterface (.+)$/', $line, $matches)) {
                $configData['loginterface'][] = trim($matches[1]);
            } elseif (preg_match('/^skip on (.+)$/', $line, $matches)) {
                $configData['skip'][] = trim($matches[1]);
            } elseif (preg_match('/^limit \{(.+)\}$/', $line, $matches)) {
                $limits = explode(',', $matches[1]);
                foreach ($limits as $limit) {
                    if (preg_match('/([\w-]+)\s+(\d+)/', trim($limit), $limitMatches)) {
                        $configData['limit'][$limitMatches[1]] = (int) $limitMatches[2];
                    }
                }
            } elseif (preg_match('/^timeout \{(.+)\}$/', $line, $matches)) {
                $timeouts = explode(',', $matches[1]);
                foreach ($timeouts as $timeout) {
                    if (preg_match('/([\w.]+)\s+(\d+)/', trim($timeout), $timeoutMatches)) {
                        $configData['timeout'][$timeoutMatches[1]] = (int) $timeoutMatches[2];
                    }
                }
            } else {
                // Capture all other settings as key-value pairs
                if (preg_match('/^([\w-]+)\s+(.+)$/', $line, $matches)) {
                    $configData['other_settings'][$matches[1]] = trim($matches[2]);
                }
            }
        }
    }
    
    return $configData;
}

// Retrieve and return parsed options
$response = [
    'api_status' => 'success',
    'message' => 'Options configuration retrieved successfully',
    'data' => parseOptionsConfig()
];

echo json_encode($response, JSON_PRETTY_PRINT);

?>
