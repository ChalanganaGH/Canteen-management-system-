# UniCafeteria Backend (PHP + MySQL)

This backend provides RESTful APIs for authentication, menu management (with images), order management, and user management for the UniCafeteria system. Built with PHP and MySQL.

## Features
- Student/Admin authentication
- Menu management (add/edit/delete, with image upload)
- Order placement and management
- User management
- Secure API endpoints for frontend integration

## Structure
- `/api/` — All API endpoints
- `/uploads/` — Uploaded menu images
- `/config/` — Database connection
- `/sql/` — Database schema

## Setup
1. Import the SQL schema from `/sql/schema.sql` into your MySQL database.
2. Configure database credentials in `/config/db.php`.
3. Deploy PHP files to your server.
4. Point frontend API calls to `/api/` endpoints.
