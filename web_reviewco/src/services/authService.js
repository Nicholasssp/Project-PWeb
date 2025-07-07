import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  updatePassword,
  updateEmail 
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "../firebase";

export const authService = {
  // Register new user
  async register(name, email, password) {
    try {
      console.log('Attempting to register user:', { name, email, passwordLength: password.length });
      console.log('Auth instance:', auth);
      console.log('Firebase app config:', auth.app.options);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User created successfully:', user.uid);
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      // Save user data to Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        name: name,
        email: email,
        profileImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        message: "Registrasi berhasil",
        user: {
          id: user.uid,
          name: name,
          email: email,
          token: await user.getIdToken()
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let message = "Gagal mendaftar";
      if (error.code === 'auth/email-already-in-use') {
        message = "Email sudah digunakan";
      } else if (error.code === 'auth/weak-password') {
        message = "Password minimal 6 karakter";
      } else if (error.code === 'auth/invalid-email') {
        message = "Format email tidak valid";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Email/Password authentication tidak diaktifkan di Firebase Console";
      } else if (error.code === 'auth/project-not-found') {
        message = "Project Firebase tidak ditemukan";
      }
      
      return {
        success: false,
        message: message,
        errorCode: error.code
      };
    }
  },

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Realtime Database
      const userSnapshot = await get(ref(database, `users/${user.uid}`));
      const userData = userSnapshot.val();
      
      return {
        success: true,
        message: "Login berhasil",
        user: {
          id: user.uid,
          name: userData.name,
          email: user.email,
          token: await user.getIdToken()
        }
      };
    } catch (error) {
      let message = "Login gagal";
      if (error.code === 'auth/user-not-found') {
        message = "Email tidak ditemukan";
      } else if (error.code === 'auth/wrong-password') {
        message = "Password salah";
      } else if (error.code === 'auth/invalid-email') {
        message = "Format email tidak valid";
      }
      
      return {
        success: false,
        message: message
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: "Logout berhasil"
      };
    } catch (error) {
      return {
        success: false,
        message: "Logout gagal"
      };
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        message: "Profile berhasil diperbarui"
      };
    } catch (error) {
      return {
        success: false,
        message: "Gagal memperbarui profile"
      };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Get user data from Realtime Database
  async getUserData(userId) {
    try {
      const userSnapshot = await get(ref(database, `users/${userId}`));
      if (userSnapshot.exists()) {
        return {
          success: true,
          user: { id: userId, ...userSnapshot.val() }
        };
      } else {
        return {
          success: false,
          message: "User tidak ditemukan"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Gagal mengambil data user"
      };
    }
  }
}; 