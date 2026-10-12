# 🎓 SIAKAD CyberCampus - Portal Akademik Universitas Digital Nusantara

Aplikasi web portal kampus fiktif untuk latihan praktikum keamanan siber dan pengembangan web. Sistem ini mensimulasikan lingkungan akademik perguruan tinggi lengkap dengan peran **Mahasiswa**, **Dosen**, dan **Admin**, serta sengaja dirancang memiliki **2 kerentanan keamanan web (OWASP Top 10)** untuk tujuan pengujian penetrasi (Penetration Testing / CTF Lab).

---

## 🌟 Fitur Utama Berdasarkan Peran (Role)

### 1. 👨‍🎓 Mahasiswa
- **Autentikasi & Sesi:** Masuk ke portal, melihat profil akademik, NIM, IPK, dan total SKS.
- **Kartu Hasil Studi (KHS):** Melihat rincian nilai tiap mata kuliah (Kehadiran, Tugas, UTS, UAS, Nilai Akhir, dan Huruf Mutu).
- **Pengumpulan Tugas:** Mengunggah berkas jawaban tugas kuliah, melihat catatan tugas, serta memantau status penilaian & feedback dosen.
- **Forum Diskusi:** Membaca topik diskusi perkuliahan, membuat thread topik baru, dan saling membalas komentar.

### 2. 👨‍🏫 Dosen
- **Dashboard Pengajaran:** Melihat daftar mata kuliah yang diampu dan statistik mahasiswa aktif.
- **Koreksi & Penilaian Tugas:** Memeriksa berkas yang dikumpulkan mahasiswa, memberikan nilai angka (0-100), dan menulis catatan evaluasi (feedback).
- **Manajemen Nilai Akademik:** Memasukkan dan memperbarui nilai komponen KHS (Tugas, UTS, UAS) dengan kalkulasi otomatis nilai akhir dan huruf mutu.
- **Partisipasi Forum:** Mengikuti dan memoderasi diskusi akademik kelas.

### 3. 🛡️ Administrator (Puskom)
- **Manajemen Akun (CRUD):** Tambah akun pengguna baru, perbarui data akun (nama, NIM/NIP, prodi, status), reset kata sandi, dan hapus akun.
- **Generator Akun Sintetis:** Pembuatan akun sintetis acak 1-klik untuk pengujian.
- **Monitoring Portal:** Memantau ringkasan statistik civitas akademika.

---

## 👥 Data Akun Sintetis (*Seluruh Data Unik & Berbeda)

| Peran | Nama Lengkap | Username | NIM / NIP | Program Studi / Unit | Kata Sandi |
|---|---|---|---|---|---|
| **Mahasiswa** | Budi Santoso | `budi.santoso` | `2301010042` | S1 Teknik Informatika | `Password123!` |
| **Mahasiswa** | Siti Nur Aminah | `siti.aminah` | `2301010089` | S1 Sistem Informasi | `Password123!` |
| **Mahasiswa** | Reza Pratama Firmansyah | `reza.firmansyah` | `2301010115` | S1 Rekayasa Keamanan Siber | `Password123!` |
| **Dosen** | Dr. Hendra Gunawan, S.Kom., M.T. | `dr.hendra` | `198204122008121003` | Dep. Keamanan Siber & Jaringan | `Password123!` |
| **Dosen** | Prof. Dr. Ratna Wulandari, M.Sc. | `prof.ratna` | `197809152003122001` | Dep. Rekayasa Perangkat Lunak | `Password123!` |
| **Admin** | Administrator Puskom | `admin.puskom` | `198501012010011005` | Biro Sistem Informasi (BAPSI) | `AdminSecure2026!` |

> 💡 **Tip Pengujian:** Pada halaman login dan bilah atas header, tersedia tombol **1-Klik Quick Switcher** untuk berpindah antar akun secara instan tanpa perlu mengetik manual.

---

## 🚨 2 Kerentanan yang Sengaja Dibuat (Security Lab)

### 1. 🪲 Celah #1: Stored Cross-Site Scripting (XSS)
- **CWE:** [CWE-79 (Improper Neutralization of Input During Web Page Generation)](https://cwe.mitre.org/data/definitions/79.html)
- **Kategori OWASP:** A03:2021 – Injection
- **Lokasi Titik Celah:** Modul **Forum Diskusi Kampus** (`/dashboard/forum` & API `/api/forum`).
- **Penyebab:** Form pembuatan topik dan balasan komentar menerima input tanpa sanitasi tag HTML/JavaScript, kemudian dirender menggunakan injeksi DOM mentah (`dangerouslySetInnerHTML`) tanpa escaping.
- **Langkah Reproduksi (PoC):**
  1. Masuk sebagai Mahasiswa Budi atau Reza.
  2. Masuk ke menu **Forum Diskusi**, lalu klik **Buat Topik Baru** atau form komentar.
  3. Masukkan payload PoC:
     ```html
     <img src="x" onerror="alert('🚨 Stored XSS Berhasil! Cookie: ' + document.cookie)">
     ```
     atau payload visual defacement:
     ```html
     <div style="background:#dc2626;color:white;padding:12px;border-radius:8px;font-weight:bold;">🚨 XSS Visual Defacement: Halaman Forum Berhasil Diinjeksi!</div>
     ```
  4. Klik **Terbitkan**. Skrip akan langsung tersimpan di basis data.
  5. Beralih akun ke Dosen (Dr. Hendra) atau Admin, buka halaman forum tersebut; skrip otomatis tereksekusi di peramban mereka.
- **Mitigasi:** Sanitasi input menggunakan library terpercaya (seperti `DOMPurify`), hindari injeksi unescaped HTML, dan terapkan HTTP Header *Content Security Policy (CSP)*.

---

### 2. 🔓 Celah #2: Insecure Direct Object Reference (IDOR) / Kontrol Akses Lemah
- **CWE:** [CWE-639 (Authorization Bypass Through User-Controlled Key)](https://cwe.mitre.org/data/definitions/639.html) & [CWE-285 (Improper Authorization)](https://cwe.mitre.org/data/definitions/285.html)
- **Kategori OWASP:** A01:2021 – Broken Access Control
- **Lokasi Titik Celah:** 
  1. Pengambilan dan unduh berkas tugas mahasiswa (`/dashboard/assignments` dan API `/api/submissions/[id]`).
  2. Pengambilan transkrip nilai KHS (`/dashboard/grades` dan API `/api/grades?studentId=...`).
- **Penyebab:** Server API hanya mengandalkan parameter ID dari request URL tanpa memeriksa apakah user yang sedang login adalah pemilik berkas atau dosen yang berwenang.
- **Langkah Reproduksi (PoC):**
  1. Masuk sebagai Mahasiswa **Budi Santoso** (`mhs-001`, pemilik tugas ID `sub-101`).
  2. Buka menu **Tugas Kuliah**.
  3. Gunakan fitur pengujian IDOR pada halaman atau kirim request langsung:
     ```bash
     curl -X GET http://localhost:3000/api/submissions/sub-102
     ```
  4. Sistem mengembalikan data dokumen rahasia, catatan tugas, dan nilai milik **Siti Nur Aminah** (`sub-102`) atau **Reza** (`sub-103`).
  5. Begitu juga pada menu Transkrip Nilai, mahasiswa dapat mengganti parameter untuk mengintip riwayat IPK mahasiswa lain.
- **Mitigasi:** Menerapkan *Object-Level Authorization* di backend sebelum mengembalikan data, mencocokkan identitas pemohon di JWT token sesi dengan `submission.studentId`.

---

## 💻 Panduan Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js versi 18+ (disarankan Node.js v20+)
- npm

### Langkah Instalasi
```bash
# 1. Masuk ke direktori proyek
cd d:\portal_kampus

# 2. Instal dependensi
npm install

# 3. Jalankan server lokal Next.js
npm run dev
```

Buka peramban Anda di:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Panduan Publikasi ke GitHub & Deployment Publik

### 1. Inisialisasi & Push ke GitHub Publik
```bash
git init
git add .
git commit -m "feat: complete portal kampus with Stored XSS and IDOR labs"
git branch -M main
git remote add origin https://github.com/<USERNAME-ANDA>/<NAMA-REPO-PORTAL>.git
git push -u origin main
```

### 2. Deployment Gratis ke Vercel (Untuk Mendapatkan Link URL Publik)
1. Buka [https://vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Klik **Add New Project** &rarr; Pilih repositori GitHub `portal_kampus`.
3. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.
4. Klik **Deploy**. Dalam 1-2 menit aplikasi akan aktif dan Anda mendapatkan link publik seperti:
   `https://portal-kampus-udikom.vercel.app`
