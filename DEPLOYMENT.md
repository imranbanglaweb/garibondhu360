# Garibondhu360 Deployment Guide for cPanel

This guide covers deploying both the Laravel backend and Next.js frontend to cPanel hosting.

---

## Prerequisites

- cPanel hosting with **PHP 8.1+** and **MySQL**
- Node.js (for building frontend)
- Composer (for Laravel)

---

## Step 1: Build the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
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

### 3.2 Upload Backend Files
1. Compress `backend` folder as `backend.zip`
2. Upload to `public_html/` via cPanel File Manager
3. Extract the zip file
4. Move all contents from `backend/` folder to `public_html/`
5. The structure should be:
   ```
   public_html/
   ├── app/
   ├── bootstrap/
   ├── config/
   ├── public/
   ├── routes/
   ├── vendor/
   ├── .env
   ├── artisan
   └── composer.json
   ```

### 3.3 Configure Backend
1. Edit `.env` file in `public_html/`:
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

2. Set proper permissions:
   - Folders: `755`
   - Storage folder: `775`

### 3.4 Upload Frontend Static Files
After running `npm run build`:
1. Navigate to `frontend/out` folder
2. Upload ALL contents to `public_html/`
3. Keep the `_next` folder as-is (Next.js static files)

---

## Step 4: Configure .htaccess

Create/edit `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # API requests go to Laravel
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ public/index.php [L]
    
    # Frontend static files (Next.js)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>
```

---

## Step 5: Update Frontend API Configuration

Edit `frontend/app/services/api.ts` before building:

```typescript
const API_URL = 'https://yourdomain.com/api';
```

---

## Step 6: Set Permissions

In cPanel Terminal or SSH:

```bash
find /home/username/public_html -type f -chmod 644
find /home/username/public_html -type d -chmod 755
chmod -R 775 /home/username/public_html/storage
chmod -R 775 /home/username/public_html/bootstrap/cache
```

---

## Step 7: Important Commands After Upload

Run these in cPanel Terminal:

```bash
# Generate key
php artisan key:generate

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan optimize

# Set storage link (if not already)
php artisan storage:link
```

---

## Troubleshooting

### 500 Error
- Check `.env` file exists and has correct values
- Run `php artisan config:clear`
- Check error logs in cPanel

### API Not Working
- Ensure `.htaccess` is correct
- Check Laravel logs in `storage/logs/laravel.log`

### Images Not Loading
- Run `php artisan storage:link`
- Check storage permissions

---

## Quick Summary

1. Build frontend: `cd frontend && npm run build`
2. Upload `frontend/out/*` to `public_html/`
3. Upload `backend/*` to `public_html/` (except .git)
4. Create database and import data
5. Configure `.env` with database credentials
6. Run artisan commands
7. Set permissions

---

For support, check cPanel Error Logs or Laravel logs at `storage/logs/laravel.log`
