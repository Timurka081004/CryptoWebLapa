<?php
// Database connection
$mysqli = new mysqli('localhost', 'root', '', 'crypto_data');

// Check connection
if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

// Prepare data
$newUsername = $_POST['newUsername'];

// Prepared statement
$stmt = $mysqli->prepare("UPDATE users SET username = ? WHERE id = ?");
$stmt->bind_param("si", $newUsername, $userId); // It is assumed that $userId contains the identifier of the current user
$userId = 1; // Replace with the actual user identifier or retrieve it from session or request
$stmt->execute();

// Check if the query was successful
if ($stmt->affected_rows === 1) {
    $response = array('success' => true);
} else {
    $response = array('success' => false);
}

// Close connection and terminate script
$stmt->close();
$mysqli->close();
echo json_encode($response);
?>
