# Alumni Management System

Sistem manajemen alumni untuk Ikatan Keluarga Alumni SMAN 2 Kendal.

Project ini mencakup:
- website publik untuk beranda, direktori alumni, lapak usaha, dan pendaftaran mandiri
- panel admin untuk verifikasi, CRUD data, import CSV, pengaturan halaman depan, kategori lapak, provinsi, dan pengguna admin
- backend API berbasis Express yang memakai Supabase Postgres dan Supabase Storage

## Fitur Utama

- autentikasi admin berbasis session cookie
- dashboard admin responsif
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
  - nomor HP usaha terpisah dari nomor HP alumni
- pengaturan halaman depan:
  - favicon
  - logo
  - hero section
  - hide/show teks logo
  - nomor WhatsApp publik
- manajemen kategori lapak
- manajemen provinsi
- manajemen pengguna admin
- direktori alumni publik dengan filter
- lapak alumni publik dengan filter
- pendaftaran alumni mandiri dengan alur verifikasi admin

## Stack

- Frontend: HTML, Tailwind CSS via CDN, vanilla JavaScript
- Backend: Node.js, Express
- Database: Supabase Postgres
- Storage: Supabase Storage
- Upload: Multer
- Mailer: Nodemailer
- Deploy target utama: Vercel

## Struktur Project

- `frontend/`
  - halaman publik
  - login admin
  - panel admin
- `backend/`
  - controller
  - model
  - route
  - middleware
  - bootstrap schema database
- `api/`
  - entrypoint serverless untuk Vercel
- `docs/`
  - panduan deployment

## Quick Start Lokal

### 1. Clone repo

```powershell
git clone <url-repository-anda>
cd <nama-folder-project>
```

### 2. Buat file environment

```powershell
Copy-Item backend/.env.example backend/.env
```

Lalu isi `backend/.env` dengan kredensial Supabase Anda.

### 3. Siapkan Supabase

Minimal isi:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:YOUR-PASSWORD@HOST:5432/postgres
DB_SSL=true
DB_POOL_MAX=5
SUPABASE_URL=https://PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
SUPABASE_STORAGE_BUCKET=ikasmanda-assets
```

Catatan:
- untuk lokal, session pooler atau direct connection sama-sama bisa dipakai selama koneksinya valid
- untuk Vercel, gunakan connection string Supabase pooler
- bucket `ikasmanda-assets` sebaiknya dibuat `public` jika dipakai untuk asset halaman depan

Schema dan seed awal akan diterapkan otomatis saat server pertama kali dijalankan.

### 4. Install dependency

Dari root project:

```powershell
npm install
```

Script root akan meneruskan instalasi ke folder `backend/`.

### 5. Jalankan project

Dari root project:

```powershell
npm run dev
```

Server default berjalan di:

- `http://localhost:3000`

Jika port `3000` sedang dipakai, backend akan otomatis mencoba `3001`, `3002`, dan seterusnya.

### 6. Akses aplikasi

- website publik: `http://localhost:3000/`
- direktori: `http://localhost:3000/direktori`
- lapak: `http://localhost:3000/lapak`
- pendaftaran: `http://localhost:3000/pendaftaran`
- login admin: `http://localhost:3000/admin`

## Script Root

File [package.json](./package.json) di root menyediakan script:

- `npm install`
- `npm run dev`
- `npm run start`

Semua script itu meneruskan eksekusi ke backend, jadi Anda tidak perlu `cd backend` dulu.

## Environment Variables

Contoh konfigurasi:
- [backend/.env.example](./backend/.env.example)
- [backend/.env.production.example](./backend/.env.production.example)

Variabel penting:

- `PORT`
- `DATABASE_URL`
- `DB_SSL`
- `DB_POOL_MAX`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
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

Backend juga masih mendukung alternatif variabel terpisah:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Database dan Seed

Saat backend start, bootstrap akan otomatis menerapkan schema PostgreSQL dari [backend/config/schema.sql](./backend/config/schema.sql).

Tabel utama:

- `alumni`
- `usaha`
- `lapak_categories`
- `provinces`
- `admin_users`
- `admin_sessions`
- `site_settings`

Seed awal mencakup:

- kategori lapak default
- daftar provinsi Indonesia
- site settings default
- admin bootstrap dari env jika belum ada

## Deploy ke Vercel

Arsitektur production yang direkomendasikan:

- Vercel untuk frontend dan API serverless
- Supabase Postgres untuk database
- Supabase Storage untuk upload asset

Pengaturan Vercel yang disarankan:

- `Framework Preset`: `Other`
- `Install Command`: `npm install --prefix backend`
- `Build Command`: kosong
- `Output Directory`: kosong
- `Node.js Version`: `22.x`

Untuk `DATABASE_URL` di Vercel, gunakan connection string Supabase pooler, bukan direct connection `db.<project>.supabase.co`.

Lihat panduan lengkap:
- [docs/deploy-vercel.md](./docs/deploy-vercel.md)
- [vercel.json](./vercel.json)

## Deploy ke Coolify

Dokumentasi tambahan:
- [docs/deploy-coolify.md](./docs/deploy-coolify.md)
- [docs/deploy-coolify-checklist.md](./docs/deploy-coolify-checklist.md)

## Catatan Keamanan

- jangan commit `backend/.env`
- jangan commit secret Supabase asli ke file example
- jangan pakai `SUPABASE_SERVICE_ROLE_KEY` di frontend
- ganti password admin default sebelum production
- rotate password database jika pernah terekspos

## Changelog

- [CHANGELOG.md](./CHANGELOG.md)

## Lisensi

Belum ditentukan.
