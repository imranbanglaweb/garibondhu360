# Garibondhu360 Deployment Guide for cPanel

This guide covers deploying both the Laravel backend and Next.js frontend to cPanel hosting.

---

## Prerequisites

- cPanel hosting with **PHP 8.1+** and **MySQL**
- Node.js (for building frontend)
- Composer (for Laravel)

---

## Project Structure

For separate backend directory, the structure should be:
```
public_html/
├── index.html              # Frontend static files
├── _next/                  # Next.js static assets
├── images/
├── contact.html
├── pricing.html
├── .htaccess               # Main routing rules
├── backend/                # Laravel Backend
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── public/             # Backend entry point
│   │   ├── index.php
│   │   └── .htaccess
│   ├── routes/
│   ├── vendor/
│   ├── .env
│   ├── artisan
│   └── composer.json
```

---

## Step 1: Build the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production (static export)
npm run build
```

After building, the static files will be in `frontend/out` folder.

---

## Step 2: Prepare Laravel Backend

```bash
# Navigate to backend directory
cd backend

# Install Composer dependencies
composer install --optimize-autoloader --no-dev

# Generate application key
php artisan key:generate

# Create storage link
php artisan storage:link

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

---

## Step 3: Upload to cPanel

### 3.1 Create Database
1. Login to **cPanel → MySQL Databases**
2. Create database: `garibondhu360`
3. Create user and assign to database
4. Import your database dump (if available)

### 3.2 Upload Frontend Static Files
After running `npm run build`:
1. Navigate to `frontend/out` folder
2. Upload ALL contents to `public_html/`
3. Keep the `_next` folder as-is (Next.js static files)

### 3.3 Upload Backend Files
1. Create a folder named `backend` in `public_html/`
2. Upload ALL contents from `backend/` folder to `public_html/backend/`
   - EXCLUDE: `.git` folder if exists
   - INCLUDE: `.env` file with production settings
3. The structure should be:
   ```
   public_html/backend/
   ├── app/
   ├── bootstrap/
   ├── config/
   ├── public/        # Entry point for API
   ├── routes/
   ├── vendor/
   ├── storage/
   ├── .env
   ├── artisan
   └── composer.json
   ```

### 3.4 Configure Backend .htaccess
In `public_html/backend/public/.htaccess`, ensure Laravel routing is correct:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /backend/public/
    
    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### 3.5 Configure Main .htaccess
Create/edit `public_html/.htaccess`:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # API requests go to backend Laravel
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ backend/public/index.php [L]

    # Frontend static files (Next.js)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>
```

### 3.6 Configure Backend .env
Edit `public_html/backend/.env`:
```env
APP_NAME="Garibondhu360"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=garibondhu360
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SESSION_DRIVER=file
CACHE_DRIVER=file
```

---

## Step 4: Update Frontend API Configuration

Edit `frontend/app/services/api.ts` before building:
```typescript
const API_URL = 'https://yourdomain.com/api';
```

---

## Step 5: Set Permissions

In cPanel Terminal or SSH:

```bash
# Frontend files
find /home/username/public_html -type f -chmod 644
find /home/username/public_html -type d -chmod 755

# Backend files
chmod -R 755 /home/username/public_html/backend/
chmod -R 775 /home/username/public_html/backend/storage
chmod -R 775 /home/username/public_html/backend/bootstrap/cache
```

---

## Step 6: Important Commands After Upload

Run these in cPanel Terminal:

```bash
cd /home/username/public_html/backend

# Generate key
php artisan key:generate

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan optimize

# Set storage link
php artisan storage:link
```

---

## Troubleshooting

### 500 Error
- Check `.env` file exists in `backend/` and has correct values
- Run `php artisan config:clear`
- Check error logs in cPanel

### API Not Working
- Ensure `.htaccess` is correct
- Verify backend path in .htaccess points to `backend/public/`
- Check Laravel logs in `backend/storage/logs/laravel.log`

### Images Not Loading
- Run `php artisan storage:link`
- Check storage permissions

---

## Quick Summary

1. Build frontend: `cd frontend && npm run build`
2. Upload `frontend/out/*` to `public_html/`
3. Create `public_html/backend/` folder
4. Upload `backend/*` to `public_html/backend/`
5. Create `public_html/.htaccess` with routing rules
6. Create database and import data
7. Configure `public_html/backend/.env` with database credentials
8. Run artisan commands in `public_html/backend/`
9. Set permissions

---

For support, check cPanel Error Logs or Laravel logs at `backend/storage/logs/laravel.log`
