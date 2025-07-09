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
if (!isset($data['ip_address']) || !isset($data['subnet_mask']) || !isset($data['nic_name']) || !isset($data['category'])) {
    echo json_encode(["status" => "error", "message" => "Missing required parameters."]);
    exit();
}

$interface = escapeshellarg($data['nic_name']);
$ip_address = escapeshellarg($data['ip_address']);
$netmask = escapeshellarg($data['subnet_mask']);
$category = $data['category'];

// Define rc.conf file path
$rc_conf = "/etc/rc.conf";
$config_commands = [];

// If category is master_nic, update the main interface
if ($category === "master_nic") {
    // Replace the line in rc.conf for the main interface
    $config_commands[] = "/usr/local/bin/sudo sed -i '' 's|^ifconfig_$interface=.*|ifconfig_$interface=\"inet $ip_address netmask $netmask\"|' $rc_conf";
}

// If category is sub_nic, configure a sub-interface (use alias instead of :1)
elseif ($category === "sub_nic") {
    $config_commands[] = "/usr/local/bin/sudo sed -i '' 's|^ifconfig_$interface=.*|ifconfig_$interface=\"inet $ip_address netmask $netmask\"|' $rc_conf";
    
}

// Apply the configuration changes
foreach ($config_commands as $cmd) {
    exec($cmd);
}

// Restart networking services (FreeBSD-specific commands)
$restart_command = "/usr/local/bin/sudo /usr/sbin/service netif restart && /usr/local/bin/sudo /usr/sbin/service routing restart 2>&1";
$output = [];
$return_var = 0;
exec($restart_command, $output, $return_var);

if ($return_var !== 0) {
    echo json_encode(["status" => "error", "message" => "System Error.", "output" => $output]);
} else {
    echo json_encode(["status" => "success", "message" => "Updated successfully.", "output" => $output]);
}

?>
