<?php
// User management API: get all users (admin only)
header('Content-Type: application/json');
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, name, regno, username, email, role, created_at FROM users');
    $users = $stmt->fetchAll();
    echo json_encode($users);
    exit;
}

echo json_encode(['error' => 'Invalid request']);
