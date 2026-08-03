-- Complete Database Setup Script
-- This will fix the structure and add sample data

-- Step 1: Add missing columns to menu_items if they don't exist
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE AFTER price;

-- Step 2: Add missing columns to orders table if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS queue_number INT NOT NULL DEFAULT 0 AFTER student_id;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER queue_number;

-- Rename timestamp to created_at if it exists
ALTER TABLE orders 
CHANGE COLUMN IF EXISTS timestamp created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 3: Add price column to order_items if it doesn't exist
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS price DECIMAL(8,2) NOT NULL DEFAULT 0.00 AFTER quantity;

-- Step 4: Clear existing data (optional - remove if you want to keep existing data)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;
DELETE FROM users;

-- Step 5: Insert sample admin user (password: admin123)
INSERT INTO users (name, username, password, role) VALUES 
('Admin User', 'admin', 'admin123', 'admin');

-- Step 6: Insert sample student users
INSERT INTO users (name, regno, email, password, role) VALUES 
('John Doe', 'STU001', 'john@university.edu', 'password123', 'student'),
('Jane Smith', 'STU002', 'jane@university.edu', 'password123', 'student');

-- Step 7: Insert sample menu items
INSERT INTO menu_items (name, description, price, available, created_by) VALUES 
('Chicken Rice', 'Delicious grilled chicken with steamed rice', 250.00, 1, 1),
('Vegetable Fried Rice', 'Mixed vegetables with fried rice', 180.00, 1, 1),
('Chicken Burger', 'Juicy chicken burger with fries', 220.00, 1, 1),
('Fish & Chips', 'Crispy fried fish with potato chips', 280.00, 1, 1),
('Pasta Carbonara', 'Creamy pasta with bacon', 300.00, 1, 1),
('Caesar Salad', 'Fresh salad with caesar dressing', 150.00, 1, 1),
('Pizza Margherita', 'Classic cheese pizza', 350.00, 1, 1),
('Fruit Juice', 'Fresh mixed fruit juice', 80.00, 1, 1),
('Coffee', 'Hot brewed coffee', 60.00, 1, 1),
('Ice Cream', 'Vanilla ice cream', 100.00, 1, 1);

-- Verify the data
SELECT 'Users created:' as Status, COUNT(*) as Count FROM users;
SELECT 'Menu items created:' as Status, COUNT(*) as Count FROM menu_items;
