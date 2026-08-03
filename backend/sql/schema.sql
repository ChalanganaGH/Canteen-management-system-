-- UniCafeteria Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    regno VARCHAR(20), -- For students
    username VARCHAR(50), -- For admins
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    image VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Orders table with queue_number and total_price
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    queue_number INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(8,2) NOT NULL, -- Store price at time of order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, username, password, role) VALUES 
('Admin User', 'admin', 'admin123', 'admin');

-- Insert sample student users
INSERT INTO users (name, regno, email, password, role) VALUES 
('John Doe', 'STU001', 'john@university.edu', 'password123', 'student'),
('Jane Smith', 'STU002', 'jane@university.edu', 'password123', 'student');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, available, created_by) VALUES 
('Chicken Rice', 'Delicious grilled chicken with steamed rice', 250.00, TRUE, 1),
('Vegetable Fried Rice', 'Mixed vegetables with fried rice', 180.00, TRUE, 1),
('Chicken Burger', 'Juicy chicken burger with fries', 220.00, TRUE, 1),
('Fish & Chips', 'Crispy fried fish with potato chips', 280.00, TRUE, 1),
('Pasta Carbonara', 'Creamy pasta with bacon', 300.00, TRUE, 1),
('Caesar Salad', 'Fresh salad with caesar dressing', 150.00, TRUE, 1),
('Pizza Margherita', 'Classic cheese pizza', 350.00, TRUE, 1),
('Fruit Juice', 'Fresh mixed fruit juice', 80.00, TRUE, 1),
('Coffee', 'Hot brewed coffee', 60.00, TRUE, 1),
('Ice Cream', 'Vanilla ice cream', 100.00, TRUE, 1);
