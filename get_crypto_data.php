<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crypto_data";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetching cryptocurrency data from the database
$sql = "SELECT currency_name, price, price_change_24h FROM crypto_info";
$result = $conn->query($sql);

$cryptoData = array();

if ($result->num_rows > 0) {
    // Forming an array of cryptocurrency data
    while($row = $result->fetch_assoc()) {
        $cryptoData[] = $row;
    }
} else {
    echo "0 results";
}
$conn->close();

// Outputting data in JSON format
header('Content-Type: application/json');
echo json_encode($cryptoData);
?>
