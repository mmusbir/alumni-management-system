# Panduan Deploy ke Vercel

Project ini direkomendasikan dideploy dengan kombinasi:

- Vercel untuk frontend statis dan API serverless
- Supabase Postgres untuk database
- Supabase Storage untuk upload asset

## 1. Persiapan

Siapkan:

- project Supabase aktif
- bucket Storage public, misalnya `ikasmanda-assets`
- connection string Postgres dari Supabase pooler
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- repository GitHub yang sudah terhubung ke Vercel

## 2. Environment Variables di Vercel

Tambahkan minimal:

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://postgres.[PROJECT-REF]:YOUR-PASSWORD@HOST:5432/postgres
DB_SSL=true
SUPABASE_URL=https://PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
SUPABASE_STORAGE_BUCKET=ikasmanda-assets

CORS_ORIGIN=https://domain-anda.vercel.app

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="IKA SMANDA Kendal <noreply@domainanda.com>"

ADMIN_DEFAULT_NAME=Admin IKA SMANDA
ADMIN_DEFAULT_EMAIL=admin@domainanda.com
ADMIN_DEFAULT_PASSWORD=ganti-password-kuat
ADMIN_SESSION_TTL_SECONDS=43200
```

## 3. Routing Vercel

Project ini memakai [vercel.json](d:/Laragon/www/ikasmanda/vercel.json) untuk:

- mengarahkan `/api/*` ke function Express di `api/[...all].js`
- me-rewrite halaman seperti `/admin`, `/direktori`, `/lapak`, dan `/pendaftaran` ke file HTML di folder `frontend/`

## 4. Upload File

Di mode Vercel:

- gambar site settings diupload ke Supabase Storage
- CSV import dibaca dari memory, tidak disimpan ke disk server

Catatan:

- upload gambar dibatasi kecil agar aman untuk request limit Vercel
- bucket Storage sebaiknya public agar URL asset bisa langsung dipakai di frontend

## 5. Database Bootstrap

Saat function backend pertama kali dijalankan, aplikasi akan memastikan schema di [backend/config/schema.sql](d:/Laragon/www/ikasmanda/backend/config/schema.sql) sudah diterapkan.

## 6. Verifikasi Setelah Deploy

Cek hal berikut:

1. homepage terbuka di domain Vercel
2. `/api/health` mengembalikan sukses
3. login admin berhasil
4. upload logo, favicon, dan hero berhasil
5. asset yang diupload muncul dari Supabase Storage
6. pendaftaran alumni berhasil tersimpan di Supabase Postgres
