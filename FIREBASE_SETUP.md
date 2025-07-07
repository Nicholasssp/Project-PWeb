# Firebase Setup Guide

## Langkah 1: Buat Proyek Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau "Tambah proyek"
3. Berikan nama proyek (contoh: `reviewco-app`)
4. Ikuti langkah-langkah setup hingga selesai

## Langkah 2: Aktifkan Authentication

1. Di Firebase Console, pilih proyek Anda
2. Klik "Authentication" di sidebar
3. Klik tab "Sign-in method"
4. Aktifkan "Email/Password" provider
5. Klik "Save"

## Langkah 3: Buat Firestore Database

1. Klik "Firestore Database" di sidebar
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi server yang terdekat
5. Klik "Done"

## Langkah 4: Setup Storage

1. Klik "Storage" di sidebar
2. Klik "Get started"
3. Pilih "Start in test mode"
4. Pilih lokasi yang sama dengan Firestore
5. Klik "Done"

## Langkah 5: Dapatkan Konfigurasi Web App

1. Klik ikon gear (Settings) di sidebar
2. Klik "Project settings"
3. Scroll ke bawah ke bagian "Your apps"
4. Klik ikon web `</>`
5. Berikan nama app (contoh: `reviewco-web`)
6. Klik "Register app"
7. Salin konfigurasi yang diberikan

## Langkah 6: Update Konfigurasi Firebase

Buka file `src/firebase.js` dan ganti konfigurasi dengan yang Anda dapatkan dari Firebase Console:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Langkah 7: Setup Firestore Rules (Opsional untuk Production)

Untuk production, update Firestore Rules di Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts can be read by anyone, written by authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      // Comments sub-collection
      match /comments/{commentId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    
    // Follows can be read/written by authenticated users
    match /follows/{followId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Langkah 8: Jalankan Aplikasi

```bash
npm start
```

Aplikasi sekarang menggunakan Firebase sebagai backend dan siap digunakan!

## Struktur Data Firestore

### Collection: `users`
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  profileImage: "https://...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `posts`
```javascript
{
  userId: "user-id",
  cafeName: "Cafe Name",
  location: "Location",
  rating: 5,
  category: "Coffee Shop",
  description: "Review description",
  image: "https://...",
  likeCount: 0,
  commentCount: 0,
  likes: ["user-id1", "user-id2"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Sub-collection: `posts/{postId}/comments`
```javascript
{
  userId: "user-id",
  comment: "Comment text",
  createdAt: timestamp
}
```

### Collection: `follows`
```javascript
{
  followerId: "user-id",
  followingId: "user-id",
  createdAt: timestamp
}
``` 