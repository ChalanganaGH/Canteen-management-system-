# University Cafeteria Management System

A complete full-stack web application for managing university cafeteria operations with real-time queue management, built with React.js frontend and PHP/MySQL backend.

## 🎯 Features

### Student Module
- ✅ Register and Login with email/password authentication
- ✅ View available menu items with prices
- ✅ Place food orders with multiple items
- ✅ Automatic queue number generation
- ✅ Real-time order status tracking (Pending → Preparing → Ready → Completed)
- ✅ View current queue position and estimated wait time

### Admin Module
- ✅ Secure admin login
- ✅ Complete menu management (Add/Edit/Delete/Toggle Availability)
- ✅ View all incoming orders in real-time
- ✅ Update order status
- ✅ Queue management system

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- Axios for API communication
- React Router for navigation
- Lucide React for icons

**Backend:**
- PHP 7.4+
- MySQL Database
- REST-style APIs
- CORS enabled for localhost development

**Server:**
- XAMPP (Apache + MySQL)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [XAMPP](https://www.apachefriends.org/) (includes Apache and MySQL)
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)
- A modern web browser

## 🚀 Installation & Setup

### Step 1: Clone/Download the Project

Place the project folder in a location of your choice.

### Step 2: Database Setup

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services

2. **Create Database:**
   - Open your browser and go to `http://localhost/phpmyadmin`
   - Click on "New" to create a new database
   - Name it: `unicafeteria`
   - Click "Create"

3. **Import Database Schema:**
   - Select the `unicafeteria` database
   - Click on the "Import" tab
   - Click "Choose File" and select: `backend/sql/schema.sql`
   - Click "Go" to import

   This will create all tables and insert sample data including:
   - Admin user: `admin` / `admin123`
   - Student users: `john@university.edu` / `password123`
   - Sample menu items

### Step 3: Backend Setup

1. **Copy Backend Files to XAMPP:**
   - Copy the entire `backend` folder
   - Paste it into: `C:\xampp\htdocs\`
   - Rename it to: `canteen-management-system`
   
   Final path should be: `C:\xampp\htdocs\canteen-management-system\`

2. **Verify Database Connection:**
   - Open `C:\xampp\htdocs\canteen-management-system\config\db.php`
   - Ensure the settings are:
     ```php
     $host = 'localhost';
     $db   = 'unicafeteria';
     $user = 'root';
     $pass = '';
     ```

3. **Test Backend API:**
   - Open browser and visit: `http://localhost/canteen-management-system/api/menu.php`
   - You should see JSON response with menu items

### Step 4: Frontend Setup

1. **Navigate to Project Directory:**
   ```bash
   cd "c:\Users\Thisara Jayawardhana\Desktop\oska\canteen management system"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Base URL:**
   - Open `src/services/api.js`
   - Verify the API_BASE_URL is set to:
     ```javascript
     const API_BASE_URL = 'http://localhost/canteen-management-system/backend/api';
     ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the Application:**
   - Open your browser
   - Go to: `http://localhost:5173` (or the URL shown in terminal)

## 👥 Demo Accounts

### Student Account
- **Email:** `john@university.edu`
- **Password:** `password123`

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`

## 📁 Project Structure

```
canteen-management-system/
├── backend/
│   ├── api/
│   │   ├── auth.php          # Authentication endpoints
│   │   ├── menu.php          # Menu CRUD operations
│   │   ├── orders.php        # Order management
│   │   ├── queue.php         # Queue status
│   │   └── users.php         # User management
│   ├── config/
│   │   └── db.php            # Database connection
│   └── sql/
│       └── schema.sql        # Database schema + sample data
├── src/
│   ├── components/           # React components
│   ├── context/              # Auth context
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── StudentHome.jsx   # Student dashboard
│   │   └── AdminHome.jsx     # Admin dashboard
│   ├── services/
│   │   └── api.js            # API service layer
│   └── styles/               # CSS files
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth.php` - Login/Register

### Menu Management
- `GET /api/menu.php` - Get all menu items
- `POST /api/menu.php` - Add menu item (Admin)
- `PUT /api/menu.php` - Update menu item (Admin)
- `DELETE /api/menu.php` - Delete menu item (Admin)

### Orders
- `GET /api/orders.php` - Get orders (with filters)
- `POST /api/orders.php` - Place new order
- `PUT /api/orders.php` - Update order status (Admin)

### Queue
- `GET /api/queue.php` - Get queue status and statistics

## 🎨 Features Demonstration

### For Students:
1. **Register/Login** - Create account or login with existing credentials
2. **Browse Menu** - View all available food items with prices
3. **Place Order** - Add items to cart and checkout
4. **Get Queue Number** - Receive unique queue number after order
5. **Track Status** - Monitor order status in real-time
6. **View Queue** - See position in queue and estimated wait time

### For Admin:
1. **Login** - Access admin dashboard
2. **Manage Menu** - Add new items, update prices, toggle availability
3. **View Orders** - See all incoming orders with details
4. **Update Status** - Change order status (Pending → Preparing → Ready → Completed)
5. **Monitor Queue** - View active queue and statistics

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "Database connection failed"
- **Solution:** Ensure MySQL is running in XAMPP and database `unicafeteria` exists

**Problem:** "404 Not Found" for API calls
- **Solution:** Verify backend folder is in `C:\xampp\htdocs\canteen-management-system\`

**Problem:** CORS errors
- **Solution:** Ensure CORS headers are present in PHP files (already included)

### Frontend Issues

**Problem:** "Network Error" when making API calls
- **Solution:** Check if Apache is running and API_BASE_URL is correct

**Problem:** npm install fails
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Problem:** Port 5173 already in use
- **Solution:** Kill the process or use different port: `npm run dev -- --port 3000`

## 📝 Database Schema

### Tables:
1. **users** - Stores student and admin accounts
2. **menu_items** - Food items with prices and availability
3. **orders** - Order records with queue numbers and status
4. **order_items** - Individual items in each order

## 🔐 Security Notes

⚠️ **Important:** This is a university project for educational purposes. For production use:
- Implement password hashing (bcrypt/Argon2)
- Add input sanitization and validation
- Implement JWT or session-based authentication
- Add rate limiting
- Use HTTPS
- Implement proper error handling

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all setup steps are completed
3. Ensure XAMPP services are running
4. Check browser console for errors

## 📄 License

This project is created for educational purposes as part of university coursework.

---

**Built with ❤️ for University Cafeteria Management**
