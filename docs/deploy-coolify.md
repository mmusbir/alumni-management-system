# Panduan Deploy ke Coolify

Panduan ini dibuat untuk struktur project ini:

- `backend/` berisi aplikasi Express
- `frontend/` disajikan langsung oleh Express dari folder statis
- upload file disimpan di Supabase Storage
- database menggunakan Supabase Postgres sebagai service eksternal

Untuk project ini, metode deploy yang paling aman di Coolify adalah **Dockerfile build pack**.

## 1. Prasyarat

Sebelum mulai, siapkan:

- server dengan Coolify aktif
- domain/subdomain yang mengarah ke server Coolify
- repository GitHub:
  - `https://github.com/mmusbir/alumni-management-system`
- project Supabase yang sudah aktif
- connection string Postgres dari Supabase
- akun SMTP yang valid jika ingin email pendaftaran aktif

## 2. Struktur deploy yang direkomendasikan

Di Coolify cukup buat:

1. **Application** untuk project ini

Anda tidak perlu membuat database service terpisah di Coolify jika database memakai Supabase.

## 3. Tambahkan Application di Coolify

Di Coolify:

1. klik **Create New Resource**
2. pilih **Application**
3. hubungkan repo GitHub Anda
4. pilih repository:
   - `mmusbir/alumni-management-system`
5. branch:
   - `main`
6. **Build Pack**:
   - pilih **Dockerfile**

Karena repo ini sudah memiliki `Dockerfile` di root, Coolify bisa langsung build dari sana.

## 4. Pengaturan dasar Application

Set nilai berikut di Coolify:

- **Port Exposes**: `3000`
- **Dockerfile Location**: `./Dockerfile`
- **Base Directory**: kosongkan / root repository

## 5. Environment Variables yang wajib

Tambahkan environment variables berikut di resource application:

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://postgres.[PROJECT-REF]:YOUR-PASSWORD@HOST:5432/postgres
DB_SSL=true
SUPABASE_URL=https://PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
SUPABASE_STORAGE_BUCKET=ikasmanda-assets

CORS_ORIGIN=https://domain-anda.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=IKA SMANDA Kendal <noreply@domain-anda.com>

ADMIN_DEFAULT_NAME=Admin IKA SMANDA
ADMIN_DEFAULT_EMAIL=admin@domain-anda.com
ADMIN_DEFAULT_PASSWORD=ganti-dengan-password-kuat
ADMIN_SESSION_TTL_SECONDS=43200
```

Catatan:

- backend akan otomatis menjalankan bootstrap schema saat start
- jika Anda tidak ingin memakai `DATABASE_URL`, backend juga mendukung `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME`
- untuk Supabase, disarankan memakai connection string yang memang ditujukan untuk koneksi server/backend

## 6. Bootstrap schema database

Saat aplikasi pertama kali start, backend akan menjalankan [backend/config/schema.sql](d:/Laragon/www/ikasmanda/backend/config/schema.sql) secara otomatis.

Artinya:

- tidak perlu import SQL manual lewat CLI database
- tabel utama dan seed default akan dibuat otomatis jika belum ada
- admin default tetap dibuat dari environment variables

## 7. Tambahkan domain

Di resource application:

1. buka bagian **Domains**
2. isi domain penuh, misalnya:
   - `https://alumni.domainanda.com`

Coolify akan mengatur reverse proxy dan SSL otomatis jika domain sudah mengarah ke server.

## 8. Deploy pertama

Setelah semua siap:

1. klik **Deploy**
2. tunggu build image selesai
3. cek log deploy

Jika sukses, buka:

- `https://domain-anda.com/`
- `https://domain-anda.com/admin`

## 9. Checklist verifikasi setelah deploy

Cek hal berikut:

1. halaman publik terbuka
2. `/api/health` mengembalikan sukses
3. login admin berhasil
4. upload logo/favicon/hero berhasil
5. asset yang diupload muncul dari Supabase Storage
6. pendaftaran alumni berhasil menyimpan ke database Supabase
7. email konfirmasi berjalan jika SMTP valid

## 10. Masalah yang paling mungkin muncul

### A. Aplikasi hidup tapi database error

Penyebab paling umum:

- `DATABASE_URL` salah
- kredensial `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` salah
- Supabase belum mengizinkan koneksi dari environment deploy yang dipakai

### B. Upload asset gagal atau URL asset tidak muncul

Penyebab:

- `SUPABASE_SERVICE_ROLE_KEY` salah
- bucket `SUPABASE_STORAGE_BUCKET` belum ada atau belum public

### C. Login admin gagal setelah deploy

Cek:

- `ADMIN_DEFAULT_EMAIL`
- `ADMIN_DEFAULT_PASSWORD`
- tabel `admin_users` sudah ada

### D. Pendaftaran berhasil tapi email tidak terkirim

Penyebab:

- SMTP belum valid
- akun Gmail belum memakai app password

## 11. Rekomendasi production

Sebelum live penuh:

1. ganti password admin default ke password kuat
2. gunakan kredensial Supabase yang aman
3. set `CORS_ORIGIN` hanya ke domain production
4. aktifkan SMTP yang benar
5. backup database secara berkala dari sisi Supabase
