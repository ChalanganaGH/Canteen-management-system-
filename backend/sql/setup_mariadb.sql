-- Complete Database Setup for MariaDB
-- Run this in phpMyAdmin SQL tab or MariaDB terminal

-- Clear existing data first
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Check and show current structure
DESCRIBE menu_items;
DESCRIBE orders;
DESCRIBE order_items;

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, username, password, role) VALUES 
('Admin User', 'admin', 'admin123', 'admin');

-- Insert sample student users
INSERT INTO users (name, regno, email, password, role) VALUES 
('John Doe', 'STU001', 'john@university.edu', 'password123', 'student'),
('Jane Smith', 'STU002', 'jane@university.edu', 'password123', 'student');

-- Insert sample menu items (without 'available' column if it doesn't exist)
-- First, let's try with all columns
INSERT INTO menu_items (name, description, price, created_by) VALUES 
('Chicken Rice', 'Delicious grilled chicken with steamed rice', 250.00, 1),
('Vegetable Fried Rice', 'Mixed vegetables with fried rice', 180.00, 1),
('Chicken Burger', 'Juicy chicken burger with fries', 220.00, 1),
('Fish & Chips', 'Crispy fried fish with potato chips', 280.00, 1),
('Pasta Carbonara', 'Creamy pasta with bacon', 300.00, 1),
('Caesar Salad', 'Fresh salad with caesar dressing', 150.00, 1),
('Pizza Margherita', 'Classic cheese pizza', 350.00, 1),
('Fruit Juice', 'Fresh mixed fruit juice', 80.00, 1),
('Coffee', 'Hot brewed coffee', 60.00, 1),
('Ice Cream', 'Vanilla ice cream', 100.00, 1);

-- Verify the data
SELECT 'Users created:' as Info, COUNT(*) as Count FROM users;
SELECT 'Menu items created:' as Info, COUNT(*) as Count FROM menu_items;
SELECT 'Sample user emails:' as Info, GROUP_CONCAT(email) as Emails FROM users WHERE role='student';
