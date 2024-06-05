<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crypto_data";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$login = $_POST['login'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username='$login'";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password_hash'])) {
        echo "Login successful";
    } else {
        echo "Invalid username or password";
    }
} else {
    echo "Invalid username or password";
}

$conn->close();
?>
