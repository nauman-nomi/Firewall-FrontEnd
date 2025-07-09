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

// Validate required parameters
if (!isset($data['gateway'])) {
    echo json_encode(["status" => "error", "message" => "Missing required parameter: gateway."]);
    exit();
}

$gateway = escapeshellarg($data['gateway']);
$rc_conf = "/etc/rc.conf";


// Update gateway in rc.conf file
$update_gateway_command = "/usr/local/bin/sudo sed -i '' 's/^defaultrouter=.*/defaultrouter=\"$gateway\"/' /etc/rc.conf";
echo $update_gateway_command;
exec($update_gateway_command, $output, $return_var);

if ($return_var !== 0) {
    echo json_encode(["status" => "error", "message" => "Failed to update gateway in rc.conf.", "output" => $output]);
    exit();
}

// Restart networking services
$restart_command = "/usr/local/bin/sudo /usr/sbin/service netif restart && /usr/local/bin/sudo /usr/sbin/service routing restart 2>&1";
exec($restart_command, $output, $return_var);

if ($return_var !== 0) {
    echo json_encode(["status" => "error", "message" => "Failed to restart networking services.", "output" => $output]);
} else {
    echo json_encode(["status" => "success", "message" => "Gateway updated and network services restarted.", "output" => $output]);
}
?>
