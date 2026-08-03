-- Add missing 'available' column to menu_items table
ALTER TABLE menu_items ADD COLUMN available BOOLEAN DEFAULT TRUE AFTER price;

-- Now insert the sample data
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
