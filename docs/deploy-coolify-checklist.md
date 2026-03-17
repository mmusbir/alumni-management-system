# Checklist Deploy Coolify

Gunakan checklist ini saat deploy production.

## Sebelum Deploy

- repo terbaru sudah di-push ke GitHub
- domain sudah mengarah ke server Coolify
- project Supabase sudah aktif
- connection string Supabase sudah siap
- SMTP production sudah siap
- password admin default sudah kuat

## Konfigurasi Application

- build pack: `Dockerfile`
- dockerfile location: `./Dockerfile`
- base directory: root repository
- port expose: `3000`
- domain sudah ditambahkan di Coolify

## Environment Variables

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL`
- `DB_SSL=true`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `CORS_ORIGIN=https://domain-anda.com`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ADMIN_DEFAULT_NAME`
- `ADMIN_DEFAULT_EMAIL`
- `ADMIN_DEFAULT_PASSWORD`
- `ADMIN_SESSION_TTL_SECONDS`

## Setelah Deploy

- homepage terbuka
- `/api/health` sukses
- login admin berhasil
- direktori alumni terbuka
- lapak alumni terbuka
- upload favicon/logo/hero berhasil
- asset upload muncul dari Supabase Storage
- pendaftaran alumni berhasil tersimpan ke database Supabase
- email konfirmasi terkirim jika SMTP aktif

## Jika Gagal

- cek log build
- cek log runtime
- cek koneksi Supabase
- cek apakah `DATABASE_URL` benar
- cek apakah `SUPABASE_SERVICE_ROLE_KEY` dan bucket Storage benar
