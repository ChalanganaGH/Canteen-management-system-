export const STUDENTS = [
    { regno: 'ST001', name: 'John Doe', email: 'john@uni.edu' },
    { regno: 'ST002', name: 'Jane Smith', email: 'jane@uni.edu' },
];

export const ADMINS = [
    { username: 'admin', password: 'admin123', name: 'Cafeteria Manager' }
];

export const MENU_ITEMS = [
    { id: 1, name: 'Chicken Rice', price: 350, category: 'Lunch', image: 'https://placehold.co/400x300?text=Chicken+Rice', available: true },
    { id: 2, name: 'Vegetable Fried Rice', price: 300, category: 'Lunch', image: 'https://placehold.co/400x300?text=Veg+Rice', available: true },
    { id: 3, name: 'Fish Bun', price: 80, category: 'Snacks', image: 'https://placehold.co/400x300?text=Fish+Bun', available: true },
    { id: 4, name: 'Iced Coffee', price: 150, category: 'Beverages', image: 'https://placehold.co/400x300?text=Iced+Coffee', available: true },
    { id: 5, name: 'Chocolate Roll', price: 100, category: 'Snacks', image: 'https://placehold.co/400x300?text=Choco+Roll', available: true },
];

export const INITIAL_ORDERS = [
    { id: 'ORD001', studentId: 'ST001', items: [{ ...MENU_ITEMS[0], qty: 1 }], total: 350, status: 'ready', queueNum: 101, timestamp: Date.now() - 3600000 },
    { id: 'ORD002', studentId: 'ST002', items: [{ ...MENU_ITEMS[2], qty: 2 }], total: 160, status: 'preparing', queueNum: 102, timestamp: Date.now() - 1800000 },
];
