<?php
// Queue API: Get queue status and statistics
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    if ($method === 'GET') {
        $student_id = $_GET['student_id'] ?? null;

        // Get active orders (not completed or cancelled)
        $stmt = $pdo->query('
            SELECT o.*, u.name as student_name, u.regno 
            FROM orders o 
            JOIN users u ON o.student_id = u.id 
            WHERE o.status IN ("pending", "preparing", "ready")
            ORDER BY o.queue_number ASC
        ');
        $active_orders = $stmt->fetchAll();

        // Calculate queue statistics
        $total_in_queue = count($active_orders);
        $pending_count = 0;
        $preparing_count = 0;
        $ready_count = 0;

        foreach ($active_orders as $order) {
            if ($order['status'] === 'pending')
                $pending_count++;
            if ($order['status'] === 'preparing')
                $preparing_count++;
            if ($order['status'] === 'ready')
                $ready_count++;
        }

        // If student_id is provided, calculate their position
        $student_position = null;
        $student_queue_number = null;
        $orders_ahead = 0;
        $estimated_wait_time = 0;

        if ($student_id) {
            // Get student's latest active order
            $stmt = $pdo->prepare('
                SELECT * FROM orders 
                WHERE student_id = ? AND status IN ("pending", "preparing", "ready")
                ORDER BY created_at DESC 
                LIMIT 1
            ');
            $stmt->execute([$student_id]);
            $student_order = $stmt->fetch();

            if ($student_order) {
                $student_queue_number = $student_order['queue_number'];

                // Count orders ahead
                $stmt = $pdo->prepare('
                    SELECT COUNT(*) as count FROM orders 
                    WHERE queue_number < ? AND status IN ("pending", "preparing", "ready")
                ');
                $stmt->execute([$student_queue_number]);
                $result = $stmt->fetch();
                $orders_ahead = $result['count'];

                // Estimate wait time (5 minutes per order ahead)
                $estimated_wait_time = $orders_ahead * 5;

                // Find position in queue
                for ($i = 0; $i < count($active_orders); $i++) {
                    if ($active_orders[$i]['queue_number'] == $student_queue_number) {
                        $student_position = $i + 1;
                        break;
                    }
                }
            }
        }

        echo json_encode([
            'success' => true,
            'data' => [
                'active_orders' => $active_orders,
                'statistics' => [
                    'total_in_queue' => $total_in_queue,
                    'pending' => $pending_count,
                    'preparing' => $preparing_count,
                    'ready' => $ready_count
                ],
                'student_info' => $student_id ? [
                    'queue_number' => $student_queue_number,
                    'position' => $student_position,
                    'orders_ahead' => $orders_ahead,
                    'estimated_wait_minutes' => $estimated_wait_time,
                    'status' => $student_order['status'] ?? null
                ] : null
            ]
        ]);
        exit;
    }

    throw new Exception('Invalid request method');

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>