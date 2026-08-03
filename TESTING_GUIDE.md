# Testing Guide - Canteen Management System

## ✅ Backend API Testing

### 1. Check Backend Connection

Open these URLs in your browser to test each API endpoint:

#### Menu API
```
http://localhost/canteen-management-system/backend/api/menu.php
```
**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Chicken Rice",
      "description": "Delicious grilled chicken with steamed rice",
      "price": "250.00",
      "available": 1,
      ...
    }
  ]
}
```

#### Orders API
```
http://localhost/canteen-management-system/backend/api/orders.php
```
**Expected Response:**
```json
{
  "success": true,
  "data": []
}
```

#### Auth API (Test with POST using Postman/curl)
```
POST http://localhost/canteen-management-system/backend/api/auth.php
Content-Type: application/json

{
  "action": "login",
  "role": "admin",
  "username": "admin",
  "password": "admin123"
}
```

### 2. Database Connection Test

**Check phpMyAdmin:**
1. Go to `http://localhost/phpmyadmin`
2. Select `unicafeteria` database
3. Verify these tables exist:
   - `users`
   - `menu_items`
   - `orders`
   - `order_items`

**Sample Queries:**
```sql
-- Check users
SELECT * FROM users;

-- Check menu items
SELECT * FROM menu_items;

-- Check if admin exists
SELECT * FROM users WHERE role = 'admin';
```

## 🎯 Frontend Testing

### 1. Student Flow Test

1. **Login**
   - Email: `john@university.edu`
   - Password: `password123`
   - Should redirect to `/student`

2. **View Menu**
   - Menu items should display with:
     - ✅ Item name
     - ✅ Description
     - ✅ Price
     - ✅ Image placeholder (purple gradient with icon)
     - ✅ "Add to Cart" button

3. **Add to Cart**
   - Click "Add to Cart"
   - Item appears in right sidebar
   - Quantity controls (+/-/x) work
   - Total price calculates correctly

4. **Place Order**
   - Click "Place Order"
   - Alert shows queue number
   - Cart clears
   - Redirects to "My Orders" tab

5. **View Orders**
   - Order appears with:
     - ✅ Queue number
     - ✅ Timestamp
     - ✅ Status badge (PENDING/PREPARING/READY/COMPLETED)
     - ✅ Item list with quantities
     - ✅ Total price

### 2. Admin Flow Test

1. **Login**
   - Username: `admin`
   - Password: `admin123`
   - Should redirect to `/admin`

2. **View Dashboard**
   - Stats cards show:
     - ✅ Pending count
     - ✅ Preparing count
     - ✅ Ready count
     - ✅ Total orders

3. **Order Management (Kanban Board)**
   - Orders appear in correct columns
   - Click "Accept & Cook" → moves to Preparing
   - Click "Mark Ready" → moves to Ready
   - Click "Completed" → order moves off board

4. **Menu Management**
   - Click "Menu Management" tab
   - Table shows all menu items with:
     - ✅ Name
     - ✅ Description
     - ✅ Price
     - ✅ Available badge (Yes/No)
     - ✅ Edit/Delete buttons

5. **Add Menu Item**
   - Click "Add New Item"
   - Modal opens
   - Fill in:
     - Name: "Test Item"
     - Description: "Test description"
     - Price: 100
     - Available: ✓
   - Click "Save"
   - Item appears in table

6. **Edit Menu Item**
   - Click "Edit" on any item
   - Modal shows existing data
   - Change price to 150
   - Click "Save"
   - Table updates

7. **Delete Menu Item**
   - Click "Delete"
   - Confirm dialog appears
   - Click OK
   - Item removed from table

## 🐛 Common Issues & Solutions

### Issue: API Returns 404

**Symptoms:**
- Menu doesn't load
- Login fails with network error
- Console shows: `404 Not Found`

**Solution:**
1. Verify backend folder location:
   ```
   C:\xampp\htdocs\canteen-management-system\
   ```
2. Check Apache is running in XAMPP
3. Test URL directly: `http://localhost/canteen-management-system/backend/api/menu.php`

### Issue: Database Connection Failed

**Symptoms:**
- API returns: `{"success": false, "error": "Database connection failed"}`

**Solution:**
1. Check MySQL is running in XAMPP
2. Verify database exists: `unicafeteria`
3. Check `backend/config/db.php` settings:
   ```php
   $host = 'localhost';
   $db   = 'unicafeteria';
   $user = 'root';
   $pass = '';
   ```

### Issue: Menu Items Not Showing

**Symptoms:**
- Empty table in admin panel
- Student sees no menu items

**Solution:**
1. Re-import database schema:
   - Open phpMyAdmin
   - Select `unicafeteria`
   - Import: `backend/sql/schema.sql`

### Issue: Orders Don't Update

**Symptoms:**
- Status doesn't change
- Orders stuck in one column

**Solution:**
1. Check browser console for errors
2. Verify order status in database:
   ```sql
   SELECT id, queue_number, status FROM orders;
   ```
3. Clear browser cache and refresh

### Issue: CORS Errors

**Symptoms:**
- Console shows: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Already handled in PHP files with CORS headers
- If still occurring, check Apache mod_headers is enabled

## 📊 Field Mapping Reference

### Frontend → Backend Field Names

**Orders:**
| Frontend | Backend | Type |
|----------|---------|------|
| queue_number | queue_number | INT |
| created_at | created_at | TIMESTAMP |
| total_price | total_price | DECIMAL |
| status | status | ENUM |

**Order Items:**
| Frontend | Backend | Type |
|----------|---------|------|
| item_name | item_name (JOIN) | VARCHAR |
| quantity | quantity | INT |
| price | price | DECIMAL |

**Menu Items:**
| Frontend | Backend | Type |
|----------|---------|------|
| id | id | INT |
| name | name | VARCHAR |
| description | description | TEXT |
| price | price | DECIMAL |
| available | available | BOOLEAN (0/1) |

**Order Status Values:**
- `pending` → Order placed, waiting
- `preparing` → Kitchen is cooking
- `ready` → Ready for pickup
- `completed` → Student picked up
- `cancelled` → Order cancelled

## 🔍 Testing Checklist

### Backend Tests
- [ ] XAMPP Apache running
- [ ] XAMPP MySQL running
- [ ] Database `unicafeteria` exists
- [ ] Menu API returns JSON
- [ ] Orders API returns JSON
- [ ] Auth API accepts POST

### Frontend Tests
- [ ] Student login works
- [ ] Admin login works
- [ ] Menu items display
- [ ] Add to cart works
- [ ] Place order works
- [ ] Queue number shown
- [ ] Order status updates
- [ ] Admin can add menu item
- [ ] Admin can edit menu item
- [ ] Admin can delete menu item
- [ ] Admin can update order status

### Integration Tests
- [ ] Student order appears in admin panel
- [ ] Admin status change reflects in student view
- [ ] Real-time polling works (5 second updates)
- [ ] Cart total calculates correctly
- [ ] Available toggle works

## 🚀 Quick Test Script

Run this to verify everything is working:

**PowerShell:**
```powershell
# Test backend is accessible
Invoke-WebRequest "http://localhost/canteen-management-system/backend/api/menu.php" | Select-Object StatusCode

# Should return: StatusCode : 200

# Test database connection via phpMyAdmin
Start-Process "http://localhost/phpmyadmin"

# Start frontend
npm run dev
```

**Expected Result:**
- Backend returns `200 OK`
- phpMyAdmin opens with `unicafeteria` database
- Frontend opens on `http://localhost:5173`
- No console errors
- Login works for both roles

---

## 📝 Notes

- All timestamps use server time (PHP `CURRENT_TIMESTAMP`)
- Images are optional; fallback is purple gradient with icon
- Available toggle: `1` = available, `0` = unavailable
- Queue numbers auto-increment (never reset)
- Order polling: 5 seconds for real-time updates
