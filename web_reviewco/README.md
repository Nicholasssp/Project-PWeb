# ReviewCo - Platform Review Cafe & Restaurant 🍕☕

ReviewCo adalah platform social media khusus untuk review cafe dan restaurant yang telah **dimigrasi dari XAMPP MySQL ke Firebase**. Aplikasi ini memungkinkan pengguna untuk membagikan pengalaman mereka di cafe dan restaurant favorit dengan teknologi cloud yang modern.

## ⚠️ PENTING: Migrasi ke Firebase

Aplikasi ini telah **sepenuhnya dimigrasi dari XAMPP MySQL ke Firebase**. Semua file PHP dan database MySQL telah dihapus dan diganti dengan:
- **Firebase Authentication** untuk sistem login
- **Firebase Firestore** untuk database
- **Firebase Storage** untuk upload gambar

## 🚀 Fitur Utama

- **Firebase Authentication** - Register, Login, Logout dengan keamanan tingkat enterprise
- **Real-time Database** - Firestore untuk data yang tersinkronisasi real-time
- **Cloud Storage** - Upload foto ke Firebase Storage dengan CDN global
- **Review Posts** - Upload foto, berikan rating 1-5, tulis deskripsi
- **Social Features** - Like dan Comment yang berfungsi real-time
- **User Management** - Sistem pengguna dengan profil lengkap
- **Aggregated Rating** - Rating rata-rata untuk cafe yang sama
- **Explore & Search** - Cari cafe berdasarkan nama, lokasi, kategori
- **Follow System** - Follow pengguna lain dan lihat aktivitas mereka
- **Responsive Design** - Optimized untuk desktop dan mobile
- **Offline Support** - Aplikasi tetap berfungsi tanpa internet

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React.js** 18.2.0
- **React Router** untuk navigasi
- **Bootstrap** 5.2.3 untuk styling
- **Firebase SDK** v11.10.0
- **Font Awesome** untuk icons

### Backend (Firebase)
- **Firebase Authentication** untuk sistem login
- **Firebase Firestore** untuk database NoSQL
- **Firebase Storage** untuk penyimpanan file
- **Firebase Analytics** untuk tracking (opsional)

## 📋 Persyaratan Sistem

- **Node.js** (v14 atau lebih baru)
- **npm** atau **yarn**
- **Akun Firebase** (gratis)
- **Web Browser** modern (Chrome, Firefox, Safari, Edge)

## ⚙️ Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd web_reviewco
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase (Sudah Dikonfigurasi)
Firebase sudah dikonfigurasi dengan project ID: `web-reviewco`

Jika ingin menggunakan Firebase project sendiri:
1. Buat project Firebase baru di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Authentication, Firestore, dan Storage
3. Ganti konfigurasi di `src/firebase.js`

### 4. Jalankan Aplikasi
```bash
npm start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 🎯 Cara Penggunaan

### 1. Registrasi & Login
- Buka aplikasi di browser
- Klik "Daftar" untuk membuat akun baru dengan Firebase Auth
- Atau "Masuk" jika sudah memiliki akun
- Sistem akan otomatis mengingat login Anda

### 2. Membuat Review
- Klik tombol "Tambah Post" di dashboard
- Upload foto cafe/restaurant (disimpan di Firebase Storage)
- Isi informasi lengkap (nama, lokasi, kategori)
- Berikan rating 1-5 bintang
- Tulis review dan pengalaman Anda
- Data tersimpan real-time di Firestore

### 3. Berinteraksi dengan Review
- **Like**: Klik tombol ❤️ (tersinkronisasi real-time)
- **Comment**: Klik tombol 💬 dan tulis komentar
- **Follow**: Follow pengguna lain untuk melihat aktivitas mereka

### 4. Explore & Search
- Gunakan fitur "Explore" untuk menemukan cafe baru
- Filter berdasarkan kategori atau lokasi
- Data diambil real-time dari Firestore
