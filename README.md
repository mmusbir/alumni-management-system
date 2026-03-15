# IKA SMANDA Kendal

Website alumni IKA SMANDA Kendal dengan frontend publik dan panel admin.

## Struktur

- `frontend/` : halaman publik dan panel admin
- `backend/` : API Express + MySQL

## Menjalankan lokal

1. Salin `backend/.env.example` menjadi `backend/.env`
2. Sesuaikan konfigurasi database dan email
3. Install dependency backend:

```powershell
cd backend
npm install
```

4. Jalankan backend:

```powershell
npm run dev
```

5. Buka:

- `http://localhost:3000/`
- `http://localhost:3000/admin`

## Catatan upload GitHub

- File sensitif seperti `backend/.env` tidak ikut di-push
- Folder upload publik diabaikan, hanya struktur folder yang disimpan
- `backend/package-lock.json` tetap disimpan agar instalasi konsisten
