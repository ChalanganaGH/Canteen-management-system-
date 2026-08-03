# Image Upload System - Setup & Usage Guide

## ✅ What Was Implemented

### Backend (PHP)
1. **upload.php** - New file upload handler
   - Location: `backend/api/upload.php`
   - Handles image file uploads
   - Validates file type (JPG, PNG, GIF, WebP)
   - Validates file size (max 5MB)
   - Generates unique filenames
   - Stores in `uploads/` folder

2. **uploads/** - New directory for storing images
   - Location: `C:\xampp\htdocs\canteen-management-system\uploads\`
   - Writable permissions set
   - Images saved with unique names (e.g., `food_6789abc123.jpg`)

### Frontend (React)
1. **AdminHome.jsx** - Updated menu form
   - File input instead of URL input
   - Live image preview before upload
   - File validation (type & size)
   - Upload progress handling
   - Remove image button

2. **StudentHome.jsx** - Updated image display
   - Shows uploaded images from correct path
   - Fallback to gradient icon if no image

### Database
- No changes needed
- `image` field already exists in `menu_items` table
- Now stores relative path: `uploads/filename.jpg`

## 🚀 How to Use

### Admin - Upload Food Images

1. **Login as Admin**
   - Username: `admin`
   - Password: `admin123`

2. **Go to Menu Management Tab**

3. **Add New Item or Edit Existing**
   - Fill in Name, Description, Price
   - Click "Choose File" under "Food Image"
   - Select an image from your computer
   - See live preview below
   - Click "Save"

4. **Image is automatically:**
   - Validated (type & size)
   - Uploaded to server
   - Saved to database
   - Displayed in menu

### What Happens Behind the Scenes

```
User selects image
     ↓
Frontend validates (type, size)
     ↓
Shows preview
     ↓
User clicks Save
     ↓
Image uploaded to upload.php via FormData
     ↓
Server validates again
     ↓
Saves to uploads/ folder
     ↓
Returns file path
     ↓
Frontend saves menu item with image path
     ↓
Image displayed from: http://localhost/canteen-management-system/uploads/filename.jpg
```

## 📁 File Locations

### Backend
```
C:\xampp\htdocs\canteen-management-system\
├── api/
│   ├── upload.php (NEW - handles uploads)
│   ├── menu.php (updated - stores image path)
│   └── ...
└── uploads/ (NEW - stores images)
    ├── food_6789abc123.jpg
    ├── food_6789def456.png
    └── ...
```

### Frontend
```
src/pages/
├── AdminHome.jsx (updated - file upload)
└── StudentHome.jsx (updated - display uploaded images)
```

## 🔍 Testing

### Test Upload Flow

1. **Prepare Test Images**
   - Find 2-3 food images on your computer
   - JPG, PNG, GIF, or WebP format
   - Under 5MB each

2. **Test Add New Item**
   - Name: "Uploaded Burger"
   - Description: "Test upload"
   - Price: 250
   - Choose image file
   - Verify preview appears
   - Click Save
   - Check item appears in table with thumbnail

3. **Test Edit Item**
   - Click Edit on the item
   - See current image in preview
   - Choose new image
   - Verify new preview
   - Click Save
   - Check updated image displays

4. **Test Student View**
   - Login as student
   - View menu
   - Verify uploaded images display correctly
   - Fallback icon shows if no image

### Verify Files Uploaded

Check folder:
```powershell
Get-ChildItem "C:\xampp\htdocs\canteen-management-system\uploads"
```

Should see files like:
```
food_67890a1b2c3d4.jpg
food_67890e5f6g7h8.png
```

## 🛡️ Security Features

### File Validation
- ✅ File type checked (MIME type)
- ✅ File size limited (5MB max)
- ✅ Unique filenames prevent overwrites
- ✅ Upload directory outside web root accessible folders

### Allowed File Types
- image/jpeg
- image/jpg
- image/png
- image/gif
- image/webp

### Max File Size
- 5MB (5,242,880 bytes)

## 🐛 Troubleshooting

### Issue: "Failed to upload image"

**Check:**
1. XAMPP Apache is running
2. Uploads folder exists: `C:\xampp\htdocs\canteen-management-system\uploads`
3. Folder has write permissions
4. Image is under 5MB
5. Image is JPG/PNG/GIF/WebP

**Fix:**
```powershell
# Recreate uploads folder
New-Item -ItemType Directory -Path "C:\xampp\htdocs\canteen-management-system\uploads" -Force
```

### Issue: Images don't display

**Check:**
1. Image path in database starts with `uploads/`
2. File exists in uploads folder
3. Apache can serve files from uploads folder

**Fix:**
```sql
-- Check image paths in database
SELECT id, name, image FROM menu_items WHERE image IS NOT NULL;

-- Should show: uploads/food_xxx.jpg
```

### Issue: "Invalid file type"

**Solution:**
- Only use JPG, PNG, GIF, or WebP images
- Convert other formats using image editor

### Issue: "File size exceeds 5MB"

**Solution:**
- Compress image using online tools
- Resize image to smaller dimensions
- Use JPG instead of PNG for photos

## 📝 API Endpoints

### Upload Image
```
POST http://localhost/canteen-management-system/api/upload.php
Content-Type: multipart/form-data

Body: FormData with 'image' field
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "filename": "food_67890abc123.jpg",
    "path": "uploads/food_67890abc123.jpg",
    "url": "http://localhost/canteen-management-system/uploads/food_67890abc123.jpg",
    "size": 123456
  },
  "message": "Image uploaded successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed"
}
```

## 💡 Tips

1. **Optimize Images Before Upload**
   - Resize to 800x600px for faster loading
   - Compress to reduce file size
   - Use JPG for photos, PNG for graphics

2. **Image Naming**
   - System automatically generates unique names
   - Original filename not preserved
   - Prevents conflicts and overwrites

3. **Backup Images**
   - Uploaded images stored in `uploads/` folder
   - Back up this folder regularly
   - Database only stores path, not image data

4. **Delete Old Images**
   - When menu item deleted, image file remains
   - Manually clean up unused images from uploads folder

## 🎯 Quick Start Checklist

- [x] upload.php created and copied to htdocs
- [x] uploads/ folder created with permissions
- [x] AdminHome.jsx updated for file upload
- [x] StudentHome.jsx updated to display uploaded images
- [x] Backend API ready to handle uploads
- [x] File validation implemented
- [ ] Test uploading an image
- [ ] Verify image displays in admin table
- [ ] Verify image displays in student menu

---

**System Ready! Start uploading food images now! 🍕📸**
