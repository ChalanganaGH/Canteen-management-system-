<?php
// Orders API: place/get/update orders with queue management
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
    // GET - Fetch orders
    if ($method === 'GET') {
        $student_id = $_GET['student_id'] ?? null;
        $status = $_GET['status'] ?? null;

        // Build query
        $sql = 'SELECT o.*, u.name as student_name, u.regno 
                FROM orders o 
                JOIN users u ON o.student_id = u.id 
                WHERE 1=1';
        $params = [];

        if ($student_id) {
            $sql .= ' AND o.student_id = ?';
            $params[] = $student_id;
        }

        if ($status) {
            $sql .= ' AND o.status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY o.queue_number DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        // Fetch order items for each order
        foreach ($orders as &$order) {
            $stmt = $pdo->prepare('
                SELECT oi.*, mi.name as item_name, mi.description 
                FROM order_items oi 
                JOIN menu_items mi ON oi.menu_item_id = mi.id 
                WHERE oi.order_id = ?
            ');
            $stmt->execute([$order['id']]);
            $order['items'] = $stmt->fetchAll();
        }

        echo json_encode(['success' => true, 'data' => $orders]);
        exit;
    }

    // POST - Place new order
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['student_id']) || !isset($data['items']) || empty($data['items'])) {
            throw new Exception('Student ID and items are required');
        }

        $student_id = $data['student_id'];
        $items = $data['items']; // [{menu_item_id, quantity}]

        // Calculate total price
        $total_price = 0;
        $item_details = [];

        foreach ($items as $item) {
            if (!isset($item['menu_item_id']) || !isset($item['quantity'])) {
                throw new Exception('Each item must have menu_item_id and quantity');
            }

            // Get item price
            $stmt = $pdo->prepare('SELECT price FROM menu_items WHERE id = ?');
            $stmt->execute([$item['menu_item_id']]);
            $menu_item = $stmt->fetch();

            if (!$menu_item) {
                throw new Exception('Menu item not found: ' . $item['menu_item_id']);
            }

            $item_price = $menu_item['price'];
            $quantity = $item['quantity'];
            $total_price += $item_price * $quantity;

            $item_details[] = [
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $quantity,
                'price' => $item_price
            ];
        }

        // Get next queue number
        $stmt = $pdo->query('SELECT COALESCE(MAX(queue_number), 0) + 1 as next_queue FROM orders');
        $result = $stmt->fetch();
        $queue_number = $result['next_queue'];

        // Insert order
        $stmt = $pdo->prepare('INSERT INTO orders (student_id, queue_number, total_price, status) VALUES (?, ?, ?, "pending")');
        $stmt->execute([$student_id, $queue_number, $total_price]);

        $order_id = $pdo->lastInsertId();

        // Insert order items
        foreach ($item_details as $item) {
            $stmt = $pdo->prepare('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)');
            $stmt->execute([$order_id, $item['menu_item_id'], $item['quantity'], $item['price']]);
        }

        // Fetch complete order details
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([$order_id]);
        $order = $stmt->fetch();

        // Fetch order items
        $stmt = $pdo->prepare('
            SELECT oi.*, mi.name as item_name, mi.description 
            FROM order_items oi 
            JOIN menu_items mi ON oi.menu_item_id = mi.id 
            WHERE oi.order_id = ?
        ');
        $stmt->execute([$order_id]);
        $order['items'] = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => $order,
            'message' => 'Order placed successfully',
            'queue_number' => $queue_number
        ]);
        exit;
    }

    // PUT - Update order status
    if ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id']) || !isset($data['status'])) {
            throw new Exception('Order ID and status are required');
        }

        $id = $data['id'];
        $status = $data['status'];

        // Validate status - must match database ENUM values
        $valid_statuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!in_array($status, $valid_statuses)) {
            throw new Exception('Invalid status. Must be one of: ' . implode(', ', $valid_statuses));
        }

        $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);

        // Fetch updated order
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        echo json_encode(['success' => true, 'data' => $order, 'message' => 'Order status updated successfully']);
        exit;
    }

    throw new Exception('Invalid request method');

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>