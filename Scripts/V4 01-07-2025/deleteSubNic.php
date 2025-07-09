<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Validate API Key
$api_key = "1234567890abcdef"; // Change this to your actual key
$headers = getallheaders();

if (!isset($headers['X-API-KEY']) || $headers['X-API-KEY'] !== $api_key) {
    echo json_encode(["status" => "error", "message" => "Invalid API key."]);
    http_response_code(403);
    exit();
}

// Read the request body
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input."]);
    exit();
}

// Validate required parameter
if (!isset($data['nic_name'])) {
    echo json_encode(["status" => "error", "message" => "Missing required parameter: nic_name."]);
    exit();
}

$interface = escapeshellarg($data['nic_name']);
$rc_conf = "/etc/rc.conf";

// Remove the NIC entry from rc.conf
$remove_command = "/usr/local/bin/sudo sed -i '' '/^ifconfig_$interface=/d' $rc_conf";
exec($remove_command);

// Restart networking services
$restart_command = "/usr/local/bin/sudo /usr/sbin/service netif restart && /usr/local/bin/sudo /usr/sbin/service routing restart 2>&1";
$output = [];
$return_var = 0;
exec($restart_command, $output, $return_var);

if ($return_var !== 0) {
    echo json_encode(["status" => "error", "message" => "Command execution failed.", "output" => $output]);
} else {
    echo json_encode(["status" => "success", "message" => "NIC removed and network services restarted.", "output" => $output]);
}

?>
