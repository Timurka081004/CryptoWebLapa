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

// Get data from POST request
$currentPassword = $_POST['currentPassword'];
$newPassword = $_POST['newPassword'];

// Check for empty fields
if (empty($currentPassword) || empty($newPassword)) {
    die("Please fill in all fields");
}

// Get user ID (you can use any method here, such as sessions)
$userID = 1;

// Get current password hash from the database
$sql = "SELECT password_hash FROM users WHERE id = $userID";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $currentPasswordHash = $row['password_hash'];

    // Check current password
    if (password_verify($currentPassword, $currentPasswordHash)) {
        // Hash the new password
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update password in the database
        $updateSql = "UPDATE users SET password_hash = '$newPasswordHash' WHERE id = $userID";
        if ($conn->query($updateSql) === TRUE) {
            echo "Password updated successfully";
        } else {
            echo "Error updating password: " . $conn->error;
        }
    } else {
        echo "Incorrect current password";
    }
} else {
    echo "User not found";
}

$conn->close();
?>
