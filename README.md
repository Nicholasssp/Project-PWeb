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

## 📁 Struktur Project (Setelah Migrasi)

```
web_reviewco/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Welcome.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   ├── Explore.js
│   │   ├── Favorites.js
│   │   ├── Settings.js
│   │   ├── AddPost.js
│   │   ├── Sidebar.js
│   │   ├── ReviewCard.js
│   │   └── UserProfile.js
│   ├── services/
│   │   ├── authService.js      # Firebase Authentication
│   │   └── databaseService.js  # Firestore Operations
│   ├── firebase.js             # Firebase Configuration
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
├── FIREBASE_SETUP.md           # Panduan Setup Firebase
└── .gitignore
```

## 🔥 Firebase Services

### Authentication Service (`src/services/authService.js`)
```javascript
- register(name, email, password)     // Registrasi dengan Firebase Auth
- login(email, password)              // Login dengan Firebase Auth
- logout()                            // Logout
- updateProfile(userId, profileData)  // Update profil
- getUserData(userId)                 // Ambil data pengguna
```

### Database Service (`src/services/databaseService.js`)
```javascript
- createPost(postData)                // Buat post baru
- getPosts(userId)                    // Ambil semua posts
- getUserPosts(userId)                // Ambil posts pengguna
- likePost(postId, userId)            // Like/unlike post
- addComment(postId, userId, comment) // Tambah komentar
- getComments(postId)                 // Ambil komentar
- followUser(followerId, followingId) // Follow/unfollow
- getUserStats(userId)                // Statistik pengguna
- uploadImage(file, path)             // Upload ke Storage
```

## 📊 Struktur Data Firestore

### Collection: `users`
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  profileImage: "https://firebasestorage.googleapis.com/...",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `posts`
```javascript
{
  userId: "firebase-user-id",
  cafeName: "Cafe Name",
  location: "Location",
  rating: 5,
  category: "Coffee Shop",
  description: "Review description",
  image: "https://firebasestorage.googleapis.com/...",
  likeCount: 0,
  commentCount: 0,
  likes: ["user-id1", "user-id2"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Sub-collection: `posts/{postId}/comments`
```javascript
{
  userId: "firebase-user-id",
  comment: "Comment text",
  createdAt: Timestamp
}
```

### Collection: `follows`
```javascript
{
  followerId: "firebase-user-id",
  followingId: "firebase-user-id",
  createdAt: Timestamp
}
```

## 🎨 Design System

### Color Palette
- **Primary**: `#C69C6D` (Latte Brown)
- **Background**: `#FAFAFA` (Light Gray)
- **Text**: `#4B3F2F` (Dark Brown)
- **Cards**: `#FFFFFF` (White)
- **Accent Colors**:
  - Success: `#00B894`
  - Warning: `#FFB800`
  - Danger: `#E84393`
  - Info: `#45B7D1`

## 🚀 Keuntungan Migrasi ke Firebase

1. **Scalability**: Otomatis scale berdasarkan traffic
2. **Real-time**: Data updates secara real-time
3. **Security**: Built-in security rules dan authentication
4. **No Server Management**: Serverless architecture
5. **Global CDN**: Fast content delivery worldwide
6. **Offline Support**: Aplikasi tetap berfungsi offline
7. **Cost Effective**: Pay-as-you-use pricing
8. **Analytics**: Built-in analytics dan monitoring

## 🔧 Konfigurasi Firebase

### Firebase Project Settings
- **Project ID**: `web-reviewco`
- **Authentication**: Email/Password enabled
- **Firestore**: Test mode (untuk development)
- **Storage**: Test mode (untuk development)

### Security Rules (Production)
Untuk production, update Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /comments/{commentId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    match /follows/{followId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 Testing

Aplikasi telah diuji dengan:
- ✅ Firebase Authentication (Register/Login)
- ✅ Firestore Database Operations
- ✅ Firebase Storage Upload
- ✅ Real-time Data Sync
- ✅ Responsive Design
- ✅ Error Handling

## 📱 Deployment

Untuk deploy ke production:
```bash
npm run build
# Deploy ke Firebase Hosting, Vercel, atau Netlify
```

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add Firebase feature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

Project Link: [https://github.com/yourusername/web_reviewco](https://github.com/yourusername/web_reviewco)

---

**🎉 Migrasi ke Firebase berhasil! Aplikasi sekarang menggunakan teknologi cloud modern dengan performa dan skalabilitas yang lebih baik.** 