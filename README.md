# QR Absensi — Tahap 1

Starter project untuk sistem absensi QR lokal menggunakan Node.js, Express, SQLite, Socket.IO, dan QRCode.

## Persyaratan

- Windows 10/11
- Node.js versi LTS (disarankan Node.js 20 atau 22)
- Visual Studio Code atau editor lain
- Scanner OM200 yang dapat diuji sebagai USB HID Keyboard

## Instalasi di Windows PowerShell

1. Ekstrak folder proyek ke `D:\QR-Absensi`.
2. Buka PowerShell, lalu jalankan:

```powershell
cd D:\QR-Absensi
npm install
Copy-Item .env.example .env
npm run dev
```

3. Buka browser: `http://localhost:3000`

Jika perintah `Copy-Item` menanyakan konfirmasi overwrite, pilih sesuai kebutuhan. File `.env` cukup dibuat satu kali.

## Halaman

- `/` — Beranda
- `/generator.html` — Input nama/email dan generate QR
- `/display.html` — Scan QR melalui input keyboard scanner
- `/attendance.html` — Daftar peserta dan status kehadiran

## Alur uji awal

1. Buka QR Generator.
2. Daftarkan peserta menggunakan nama dan email.
3. Download QR yang dibuat.
4. Buka Live Display pada monitor registrasi.
5. Scan QR dari layar HP atau gambar QR menggunakan scanner.
6. Buka Daftar Kehadiran untuk memeriksa perubahan status.

Untuk pengujian scanner, jika OM200 memakai mode HID Keyboard, hasil scan harus masuk sebagai teks ke kolom scanner dan diakhiri tombol Enter. Bila belum, periksa konfigurasi mode scanner sesuai manual perangkat.

## API awal

- `GET /api/health`
- `GET /api/participants`
- `POST /api/participants` — body `{ "name": "...", "email": "..." }`
- `POST /api/attendance/scan` — body `{ "token": "..." }`
- `GET /api/attendance/summary`

## Catatan tahap 1

- Email belum dikirim. QR dibuat dan dapat diunduh; integrasi email ditunda sesuai keputusan proyek.
- Database SQLite dibuat otomatis di `database/attendance.db`.
- Email peserta dibuat unik agar tidak terdaftar dua kali.
- Satu peserta hanya dapat tercatat hadir satu kali.
- Jangan mengekspos server ke internet sebelum menambahkan autentikasi, otorisasi, HTTPS, rate limiting, dan backup database.
- Saat ini halaman admin belum dilindungi login. Gunakan hanya pada komputer/jaringan lokal tepercaya selama pengembangan.

## Rencana tahap berikutnya

1. Login admin/panitia dan hak akses.
2. Template email dan pengiriman QR otomatis.
3. Penguatan scanner, bunyi/notifikasi, dan mode layar penuh.
4. Export Excel/CSV, filter, dan rekap.
5. Backup database serta pengujian operasional.
