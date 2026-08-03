# Sample Food Image URLs for Testing

## 🍽️ Free Food Image Resources

You can use these free image URLs to test the menu items. Simply copy and paste them into the "Image URL" field when adding/editing menu items.

### Sample Images (Direct URLs)

#### Rice Dishes
```
https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop
```

#### Burgers
```
https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop
```

#### Pizza
```
https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop
```

#### Pasta
```
https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop
```

#### Fish & Seafood
```
https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1580959375944-d2d5d6c5f605?w=400&h=300&fit=crop
```

#### Salads
```
https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop
```

#### Beverages
```
https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop
```

#### Desserts
```
https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=400&h=300&fit=crop
```

## 📋 Quick SQL Update (Optional)

If you want to update existing menu items with images directly in the database:

```sql
-- Update sample menu items with images
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' WHERE name LIKE '%Chicken Rice%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1603366445787-09714680cbf1?w=400&h=300&fit=crop' WHERE name LIKE '%Fried Rice%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' WHERE name LIKE '%Burger%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop' WHERE name LIKE '%Fish%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' WHERE name LIKE '%Pasta%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' WHERE name LIKE '%Salad%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' WHERE name LIKE '%Pizza%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=300&fit=crop' WHERE name LIKE '%Juice%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&h=300&fit=crop' WHERE name LIKE '%Coffee%';
UPDATE menu_items SET image = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' WHERE name LIKE '%Ice Cream%';
```

## 🎨 How to Use

### Method 1: Add via Admin Panel
1. Login as admin (`admin` / `admin123`)
2. Go to "Menu Management" tab
3. Click "Add New Item" or "Edit" on existing item
4. Paste image URL in the "Image URL (Optional)" field
5. See live preview below the input
6. Click "Save"

### Method 2: Update via Database
1. Go to `http://localhost/phpmyadmin`
2. Select `unicafeteria` database
3. Click on `menu_items` table
4. Find the item you want to update
5. Click "Edit"
6. Paste URL in the `image` field
7. Click "Go"

## 🌐 Where to Find More Images

### Free Stock Photo Sites:
- **Unsplash** - https://unsplash.com/s/photos/food
- **Pexels** - https://www.pexels.com/search/food/
- **Pixabay** - https://pixabay.com/images/search/food/

### Tips for Image URLs:
1. ✅ Use direct image links (ending in .jpg, .png, .webp)
2. ✅ Unsplash URLs work great: `https://images.unsplash.com/photo-xxxxx`
3. ✅ Keep images around 400x300px for optimal display
4. ❌ Avoid links that redirect or require authentication
5. ❌ Don't use Google Images links (they expire)

## 🚀 Testing the Feature

1. **Add New Item with Image:**
   - Name: Test Pizza
   - Description: Delicious test pizza
   - Price: 350
   - Image URL: `https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop`
   - Available: ✓
   - Click Save

2. **Verify Display:**
   - Check admin table shows thumbnail
   - Login as student
   - View menu - image should display
   - If no image provided, purple gradient placeholder shows

3. **Edit Existing Item:**
   - Click "Edit" on any item
   - Add image URL
   - See live preview
   - Save and verify

## 🔧 Technical Details

- **Field Name:** `image` (VARCHAR 255 in database)
- **Required:** No (optional field)
- **Fallback:** Purple gradient with utensils icon
- **Preview:** Shows in modal while typing
- **Display:** 60x60px thumbnail in admin table, 150px height in student menu

---

**Note:** Images are stored as URLs, not uploaded files. This keeps the system simple and avoids file storage management. Perfect for this university project!
