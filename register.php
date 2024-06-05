<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crypto_data";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$regUsername = $_POST['regUsername'];
$regEmail = $_POST['regEmail'];
$regPassword = $_POST['regPassword'];

$hashedPassword = password_hash($regPassword, PASSWORD_DEFAULT);
$sql = "INSERT INTO users (username, email, password_hash) VALUES ('$regUsername', '$regEmail', '$hashedPassword')";
if ($conn->query($sql) === TRUE) {
    echo "Registration successful";
} else {
    echo "Error registering";
}

$conn->close();
?>
