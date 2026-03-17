# Alumni Management System

Sistem manajemen alumni untuk Ikatan Keluarga Alumni SMAN 2 Kendal.

Project ini mencakup:
- website publik untuk beranda, direktori alumni, lapak usaha, dan pendaftaran mandiri
- panel admin untuk verifikasi, CRUD data, import CSV, pengaturan halaman depan, kategori lapak, provinsi, dan user admin
- backend API berbasis Express + Supabase Postgres

## Fitur Utama

- autentikasi admin berbasis session
- dashboard admin dengan sidebar dan submenu pengaturan
- manajemen data alumni:
  - tambah
  - edit
  - hapus
  - verifikasi
  - import CSV
- manajemen data usaha alumni:
  - tambah
  - edit
  - hapus
  - verifikasi
- pengaturan halaman depan:
  - favicon
  - logo
  - hero section
  - hide/show teks logo
- manajemen kategori lapak
- manajemen provinsi
- manajemen user admin
- direktori alumni publik dengan filter
- lapak alumni publik dengan filter
- pendaftaran alumni mandiri dengan alur verifikasi admin

## Stack

- Frontend: HTML, Tailwind via CDN, vanilla JavaScript
- Backend: Node.js, Express
- Database: Supabase Postgres
- Upload: Multer
- Mailer: Nodemailer

## Struktur Folder

- `frontend/`
  - halaman publik
  - halaman login admin
  - panel admin
  - folder upload publik
- `backend/`
  - API
  - model
  - controller
  - route
  - middleware
  - bootstrap schema database

## Menjalankan Secara Lokal

### 1. Clone repository

```powershell
git clone https://github.com/mmusbir/alumni-management-system.git
cd alumni-management-system
```

### 2. Siapkan file environment

Salin file contoh:

```powershell
Copy-Item backend/.env.example backend/.env
```

Lalu sesuaikan nilai di `backend/.env`.

### 3. Siapkan Supabase

1. Buat project baru di Supabase.
2. Ambil connection string Postgres dan kredensial project dari dashboard Supabase.
3. Isi `DATABASE_URL`, `SUPABASE_URL`, dan `SUPABASE_SERVICE_ROLE_KEY` di `backend/.env`.

Contoh:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:YOUR-PASSWORD@HOST:5432/postgres
DB_SSL=true
SUPABASE_URL=https://PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
SUPABASE_STORAGE_BUCKET=ikasmanda-assets
```

Jika Anda lebih suka mengisi variabel terpisah, backend juga masih mendukung `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME`.

Schema dan seed awal akan diterapkan otomatis saat server backend pertama kali dijalankan, jadi Anda tidak perlu import SQL manual.

### 4. Install dependency

Dari root project, jalankan:

```powershell
npm install
```

Perintah ini akan meneruskan instalasi ke folder `backend/`.

Jika Anda ingin menjalankannya manual seperti sebelumnya, tetap bisa menggunakan:

```powershell
cd backend
npm install
```

### 5. Jalankan server

Dari root project, jalankan:

```powershell
npm run dev
```

Perintah ini akan meneruskan script `dev` ke `backend/`.

Jika Anda ingin menjalankannya manual dari folder backend, tetap bisa:

```powershell
cd backend
npm run dev
```

Server default berjalan di:

- `http://localhost:3000`

Jika port `3000` sedang dipakai proses lain, backend akan otomatis mencoba port berikutnya seperti `3001`, `3002`, dan seterusnya. Lihat log terminal untuk mengetahui port aktif yang dipakai.

### 6. Akses aplikasi

- Website publik: `http://localhost:3000/`
- Direktori: `http://localhost:3000/direktori`
- Lapak: `http://localhost:3000/lapak`
- Pendaftaran: `http://localhost:3000/pendaftaran`
- Login admin: `http://localhost:3000/admin`

## Konfigurasi Environment

Contoh konfigurasi tersedia di [backend/.env.example](d:/Laragon/www/ikasmanda/backend/.env.example).

Variabel utama:

- `PORT`
- `DATABASE_URL`
- `DB_SSL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `CORS_ORIGIN`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ADMIN_DEFAULT_NAME`
- `ADMIN_DEFAULT_EMAIL`
- `ADMIN_DEFAULT_PASSWORD`
- `ADMIN_SESSION_TTL_SECONDS`

## Catatan Database

Saat server start, bootstrap akan otomatis menerapkan schema PostgreSQL di [backend/config/schema.sql](d:/Laragon/www/ikasmanda/backend/config/schema.sql) dan membuat tabel berikut jika belum ada:

- `alumni`
- `usaha`
- `lapak_categories`
- `provinces`
- `admin_users`
- `admin_sessions`
- `site_settings`

Seed awal juga mencakup:

- kategori lapak default
- seluruh provinsi Indonesia
- site settings default

## Catatan Admin Bootstrap

Akun admin awal dibaca dari file `.env`.

Gunakan nilai aman sebelum deployment production, terutama:

- `ADMIN_DEFAULT_EMAIL`
- `ADMIN_DEFAULT_PASSWORD`

## Catatan Upload dan GitHub

- file sensitif seperti `backend/.env` tidak ikut di-push
- `backend/node_modules` tidak ikut repo
- asset upload production sebaiknya disimpan di Supabase Storage
- `backend/package-lock.json` tetap disimpan agar instalasi konsisten

## Catatan Production

Sebelum deploy ke server production:

- ganti kredensial admin default
- gunakan password database yang kuat
- gunakan connection string Supabase yang benar
- isi konfigurasi SMTP yang valid
- set `CORS_ORIGIN` ke domain aplikasi
- aktifkan reverse proxy jika tidak ingin memakai `:3000`

## Deploy ke Coolify

Panduan khusus deploy project ini ke Coolify tersedia di:

- [docs/deploy-coolify.md](d:/Laragon/www/ikasmanda/docs/deploy-coolify.md)
- [docs/deploy-coolify-checklist.md](d:/Laragon/www/ikasmanda/docs/deploy-coolify-checklist.md)
- [backend/.env.production.example](d:/Laragon/www/ikasmanda/backend/.env.production.example)

## Deploy ke Vercel

Panduan deploy untuk target `Vercel + Supabase` tersedia di:

- [docs/deploy-vercel.md](d:/Laragon/www/ikasmanda/docs/deploy-vercel.md)
- [vercel.json](d:/Laragon/www/ikasmanda/vercel.json)

## Changelog

Riwayat rilis dan perubahan penting tersedia di [CHANGELOG.md](d:/Laragon/www/ikasmanda/CHANGELOG.md).

## Lisensi

Belum ditentukan.
