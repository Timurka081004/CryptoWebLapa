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

// Query to get the last update time for Bitcoin
$sql = "SELECT updated_at FROM crypto_info WHERE currency_name = 'Bitcoin'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Return the last update time with added text
    $row = $result->fetch_assoc();
    echo "Last database update: " . $row["updated_at"];
} else {
    echo "0 results";
}
$conn->close();
?>
