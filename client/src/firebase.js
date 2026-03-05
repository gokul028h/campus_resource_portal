import { initializeApp } from "firebase/app";
import { signInWithRedirect } from 'firebase/auth';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Firebase config (yours is correct)
const firebaseConfig = {
  apiKey: "AIzaSyDjiumZ_ogfMziFIVm9JKPUayOk8C5HLdM",
  authDomain: "campus-resource--portal.firebaseapp.com",
  projectId: "campus-resource--portal",
  storageBucket: "campus-resource--portal.firebasestorage.app",
  messagingSenderId: "971515280162",
  appId: "1:971515280162:web:bfcdabd04c815efaa8437b",
  measurementId: "G-3E396TYFY2"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// In firebase.js
const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
provider.setCustomParameters({
  prompt: 'select_account',
  ux_mode: 'popup' // Explicitly set popup mode
});

const handleLogin = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (err) {
    console.error("Redirect error:", err);
  }
};

provider.setCustomParameters({
  prompt: "select_account" // Forces account selection every time
});

export { auth, provider };
