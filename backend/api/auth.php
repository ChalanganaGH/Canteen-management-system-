<?php
// Authentication API: login/register for student/admin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

try {
    if ($method === 'POST' && isset($data['action'])) {
        
        // LOGIN
        if ($data['action'] === 'login') {
            $role = $data['role'] ?? '';
            
            if ($role === 'student') {
                // Student login with email + password
                if (!isset($data['email']) || !isset($data['password'])) {
                    throw new Exception('Email and password are required');
                }
                
                $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND role = "student"');
                $stmt->execute([$data['email']]);
                $user = $stmt->fetch();
                
                if ($user && $user['password'] === $data['password']) {
                    unset($user['password']);
                    echo json_encode(['success' => true, 'user' => $user]);
                } else {
                    throw new Exception('Invalid email or password');
                }
                
            } elseif ($role === 'admin') {
                // Admin login with username + password
                if (!isset($data['username']) || !isset($data['password'])) {
                    throw new Exception('Username and password are required');
                }
                
                $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND role = "admin"');
                $stmt->execute([$data['username']]);
                $user = $stmt->fetch();
                
                if ($user && $user['password'] === $data['password']) {
                    unset($user['password']);
                    echo json_encode(['success' => true, 'user' => $user]);
                } else {
                    throw new Exception('Invalid username or password');
                }
            } else {
                throw new Exception('Invalid role specified');
            }
        }
        
        // REGISTER
        elseif ($data['action'] === 'register') {
            $role = $data['role'] ?? '';
            
            if ($role === 'student') {
                // Student registration
                if (!isset($data['name']) || !isset($data['regno']) || !isset($data['email']) || !isset($data['password'])) {
                    throw new Exception('All fields are required');
                }
                
                // Check if regno or email already exists
                $stmt = $pdo->prepare('SELECT id FROM users WHERE regno = ? OR email = ?');
                $stmt->execute([$data['regno'], $data['email']]);
                if ($stmt->fetch()) {
                    throw new Exception('Registration number or email already exists');
                }
                
                $stmt = $pdo->prepare('INSERT INTO users (name, regno, email, password, role) VALUES (?, ?, ?, ?, "student")');
                $stmt->execute([$data['name'], $data['regno'], $data['email'], $data['password']]);
                
                $userId = $pdo->lastInsertId();
                $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                unset($user['password']);
                
                echo json_encode(['success' => true, 'user' => $user, 'message' => 'Registration successful']);
                
            } elseif ($role === 'admin') {
                // Admin registration
                if (!isset($data['name']) || !isset($data['username']) || !isset($data['password'])) {
                    throw new Exception('All fields are required');
                }
                
                // Check if username already exists
                $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
                $stmt->execute([$data['username']]);
                if ($stmt->fetch()) {
                    throw new Exception('Username already exists');
                }
                
                $stmt = $pdo->prepare('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, "admin")');
                $stmt->execute([$data['name'], $data['username'], $data['password']]);
                
                $userId = $pdo->lastInsertId();
                $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                unset($user['password']);
                
                echo json_encode(['success' => true, 'user' => $user, 'message' => 'Admin registered successfully']);
            } else {
                throw new Exception('Invalid role specified');
            }
        } else {
            throw new Exception('Invalid action');
        }
    } else {
        throw new Exception('Invalid request method or missing action');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
