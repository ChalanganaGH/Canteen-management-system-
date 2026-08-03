<?php
// Menu API: get/add/edit/delete menu items
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

try {
    // GET - Fetch all menu items
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM menu_items ORDER BY id DESC');
        $menu = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $menu]);
        exit;
    }

    // POST - Add new menu item
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['name']) || !isset($data['price'])) {
            throw new Exception('Name and price are required');
        }

        $name = $data['name'];
        $description = $data['description'] ?? '';
        $price = $data['price'];
        $image = $data['image'] ?? null;
        $available = isset($data['available']) ? (int) $data['available'] : 1;
        $created_by = $data['created_by'] ?? null;

        $stmt = $pdo->prepare('INSERT INTO menu_items (name, description, price, image, available, created_by) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$name, $description, $price, $image, $available, $created_by]);

        $itemId = $pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE id = ?');
        $stmt->execute([$itemId]);
        $item = $stmt->fetch();

        echo json_encode(['success' => true, 'data' => $item, 'message' => 'Menu item added successfully']);
        exit;
    }

    // PUT - Update menu item
    if ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id'])) {
            throw new Exception('Item ID is required');
        }

        $id = $data['id'];
        $name = $data['name'] ?? null;
        $description = $data['description'] ?? null;
        $price = $data['price'] ?? null;
        $image = $data['image'] ?? null;
        $available = isset($data['available']) ? (int) $data['available'] : null;

        // Build dynamic update query
        $updates = [];
        $params = [];

        if ($name !== null) {
            $updates[] = 'name = ?';
            $params[] = $name;
        }
        if ($description !== null) {
            $updates[] = 'description = ?';
            $params[] = $description;
        }
        if ($price !== null) {
            $updates[] = 'price = ?';
            $params[] = $price;
        }
        if ($image !== null) {
            $updates[] = 'image = ?';
            $params[] = $image;
        }
        if ($available !== null) {
            $updates[] = 'available = ?';
            $params[] = $available;
        }

        if (empty($updates)) {
            throw new Exception('No fields to update');
        }

        $params[] = $id;
        $sql = 'UPDATE menu_items SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $stmt = $pdo->prepare('SELECT * FROM menu_items WHERE id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        echo json_encode(['success' => true, 'data' => $item, 'message' => 'Menu item updated successfully']);
        exit;
    }

    // DELETE - Delete menu item
    if ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id'])) {
            throw new Exception('Item ID is required');
        }

        $id = $data['id'];
        $stmt = $pdo->prepare('DELETE FROM menu_items WHERE id = ?');
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Menu item deleted successfully']);
        exit;
    }

    throw new Exception('Invalid request method');

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>