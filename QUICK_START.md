# Quick Start Guide - University Cafeteria Management System

## ⚡ Quick Setup (5 Minutes)

### 1. Start XAMPP
- Open XAMPP Control Panel
- Click **Start** for Apache and MySQL

### 2. Import Database
- Go to `http://localhost/phpmyadmin`
- Create database named: `unicafeteria`
- Import file: `backend/sql/schema.sql`

### 3. Copy Backend to XAMPP
```
Copy: backend folder
To: C:\xampp\htdocs\
Rename to: canteen-management-system
```

### 4. Start Frontend
```bash
cd "c:\Users\Thisara Jayawardhana\Desktop\oska\canteen management system"
npm install
npm run dev
```

### 5. Open Browser
- Frontend: `http://localhost:5173`
- Test Login:
  - **Student**: `john@university.edu` / `password123`
  - **Admin**: `admin` / `admin123`

## 🔧 Important Configuration

### Backend Path Must Be:
```
C:\xampp\htdocs\canteen-management-system\
```

### API Base URL (in src/services/api.js):
```javascript
const API_BASE_URL = 'http://localhost/canteen-management-system/backend/api';
```

## ✅ Testing Checklist

### Student Flow:
1. ✅ Login with email/password
2. ✅ View menu items
3. ✅ Add items to cart
4. ✅ Place order
5. ✅ Receive queue number
6. ✅ View order status
7. ✅ See order in "My Orders" tab

### Admin Flow:
1. ✅ Login with username/password
2. ✅ View all orders
3. ✅ Update order status
4. ✅ Add new menu item
5. ✅ Edit menu item
6. ✅ Toggle item availability
7. ✅ Delete menu item

## 🐛 Common Issues

**Issue**: API calls fail
- **Fix**: Ensure Apache is running and backend folder is in correct location

**Issue**: Database connection error
- **Fix**: Check MySQL is running and database `unicafeteria` exists

**Issue**: CORS errors
- **Fix**: Already handled in PHP files with CORS headers

**Issue**: Menu items not showing
- **Fix**: Run the schema.sql file to insert sample data

## 📊 Database Tables

- **users**: Student and admin accounts
- **menu_items**: Food items (10 sample items included)
- **orders**: Order records with queue numbers
- **order_items**: Items in each order

## 🎯 Key Features Implemented

✅ Email/Password authentication for students
✅ Username/Password authentication for admins
✅ Auto-incrementing queue numbers
✅ Real-time order status updates
✅ Menu availability toggle
✅ Complete CRUD for menu items
✅ Order filtering by student
✅ Queue position tracking
✅ Total price calculation
✅ CORS-enabled REST APIs

## 📝 Sample Data Included

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Student Users:**
- Email: `john@university.edu`, Password: `password123`
- Email: `jane@university.edu`, Password: `password123`

**Menu Items:** 10 food items with prices ranging from Rs. 60 to Rs. 350

## 🔗 API Endpoints

All endpoints are at: `http://localhost/canteen-management-system/backend/api/`

- `auth.php` - Login/Register
- `menu.php` - Menu CRUD
- `orders.php` - Order management
- `queue.php` - Queue status

## 💡 Tips

1. Keep XAMPP running while testing
2. Use browser DevTools (F12) to see API responses
3. Check Network tab for API call details
4. Orders auto-refresh every 5 seconds in student view
5. Queue numbers increment automatically

## 📞 Need Help?

1. Check XAMPP services are running
2. Verify database was imported correctly
3. Ensure backend folder is in `htdocs/canteen-management-system`
4. Check browser console for errors
5. Test API directly: `http://localhost/canteen-management-system/backend/api/menu.php`

---

**Ready to test!** 🚀
