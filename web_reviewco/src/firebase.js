// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1nWHjJYTTLDwu_BMJlUzyYFhkRiArNfI",
  authDomain: "reviewco-final.firebaseapp.com",
  projectId: "reviewco-final",
  appId: "1:561223251686:web:4139a7a8283f36f2722d27",
  databaseURL: "https://reviewco-final-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
export default app; 