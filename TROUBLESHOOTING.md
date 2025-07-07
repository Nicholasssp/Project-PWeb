# 🔧 Troubleshooting Guide - Firebase Authentication Error

## ❌ Error yang Ditemukan

```
identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBu5_mcfdDLtqtuv0XrrZb2_PS7JTBYcJY:1 
Failed to load resource: the server responded with a status of 400 ()
```

## 🔍 Analisis Masalah

Error 400 pada Firebase Authentication API biasanya disebabkan oleh:

1. **Project ID Mismatch** ✅ FIXED
2. **Authentication Provider Belum Diaktifkan** ⚠️ PERLU DICEK
3. **API Key Tidak Valid** ⚠️ PERLU DICEK
4. **Domain Tidak Terdaftar** ⚠️ PERLU DICEK

## 🛠️ Solusi yang Telah Diterapkan

### 1. ✅ Perbaikan Project ID
Project ID telah diupdate dari `web-reviewco` ke `review-co2025` di file `src/firebase.js`:

```javascript
const firebaseConfig = {
  projectId: "review-co2025",
  authDomain: "review-co2025.firebaseapp.com",
  // ... config lainnya
};
```

## 🔧 Langkah-langkah Perbaikan yang Perlu Dilakukan

### 2. 🔐 Aktifkan Firebase Authentication

**PENTING**: Anda perlu mengaktifkan Authentication di Firebase Console:

1. **Buka Firebase Console**
   - Kunjungi: https://console.firebase.google.com/project/review-co2025
   - Login dengan akun yang sama (e.nicholassp@gmail.com)

2. **Aktifkan Authentication**
   - Klik "Authentication" di sidebar kiri
   - Klik tab "Sign-in method"
   - Klik "Email/Password"
   - Toggle "Enable" untuk Email/Password
   - Klik "Save"

3. **Verifikasi Domain**
   - Di tab "Settings" → "Authorized domains"
   - Pastikan domain berikut sudah terdaftar:
     - `localhost` (untuk development)
     - `review-co2025.web.app` (untuk production)
     - `review-co2025.firebaseapp.com`

### 3. 🔑 Verifikasi API Key

Pastikan API Key masih valid:
- API Key saat ini: `AIzaSyBu5_mcfdDLtqtuv0XrrZb2_PS7JTBYcJY`
- Jika tidak bekerja, generate API key baru di Firebase Console

### 4. 🌐 Setup Firestore Database

Jika belum ada, buat Firestore database:

1. **Buka Firestore**
   - Klik "Firestore Database" di sidebar
   - Klik "Create database"

2. **Pilih Mode**
   - Pilih "Start in test mode" (untuk development)
   - Pilih lokasi: `asia-southeast1` (Singapore)

3. **Klik "Done"**

### 5. 📁 Setup Firebase Storage

Untuk upload gambar:

1. **Buka Storage**
   - Klik "Storage" di sidebar
   - Klik "Get started"

2. **Pilih Mode**
   - Pilih "Start in test mode"
   - Pilih lokasi yang sama: `asia-southeast1`

3. **Klik "Done"**

## 🔄 Setelah Setup Firebase Console

### 1. Build Ulang Aplikasi
```bash
npm run build
```

### 2. Deploy Ulang
```bash
firebase deploy
```

### 3. Test Authentication
- Buka https://review-co2025.web.app
- Coba register dengan email dan password
- Coba login

## 📋 Checklist Verifikasi

Pastikan semua langkah berikut sudah dilakukan:

- [ ] ✅ Project ID diupdate ke `review-co2025`
- [ ] 🔐 Authentication Email/Password diaktifkan
- [ ] 🌐 Domain authorized (localhost, review-co2025.web.app)
- [ ] 🗃️ Firestore Database dibuat
- [ ] 📁 Firebase Storage diaktifkan
- [ ] 🔄 Aplikasi di-build dan deploy ulang
- [ ] 🧪 Test register/login berhasil

## 🚨 Jika Masih Error

### Cek Browser Console
Buka Developer Tools (F12) dan lihat error detail di Console tab.

### Cek Network Tab
Lihat request yang gagal di Network tab untuk detail error.

### Alternative Solutions

1. **Regenerate API Key**
   - Di Firebase Console → Project Settings → General
   - Scroll ke "Your apps" → Web app
   - Regenerate config

2. **Buat Project Firebase Baru**
   - Jika masalah persist, buat project Firebase baru
   - Update semua konfigurasi

3. **Clear Browser Cache**
   - Clear cache dan cookies
   - Try incognito/private mode

## 📞 Langkah Selanjutnya

1. **Ikuti langkah-langkah di atas** untuk setup Firebase Console
2. **Build dan deploy ulang** aplikasi
3. **Test authentication** di browser
4. **Report back** jika masih ada error

---

## 💡 Tips Debugging

```javascript
// Tambahkan logging di authService.js untuk debug
console.log('Firebase config:', firebaseConfig);
console.log('Auth instance:', auth);

// Test koneksi Firebase
import { connectAuthEmulator } from 'firebase/auth';
// Hanya untuk debugging, jangan di production
```

## 🎯 Expected Result

Setelah semua setup benar, Anda akan bisa:
- ✅ Register akun baru
- ✅ Login dengan email/password
- ✅ Melihat user data di Firebase Console
- ✅ Menggunakan semua fitur aplikasi

**Update status setelah mengikuti langkah-langkah di atas!** 