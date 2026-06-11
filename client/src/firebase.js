// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'genwebai-ff7e2.firebaseapp.com',
  projectId: 'genwebai-ff7e2',
  storageBucket: 'genwebai-ff7e2.firebasestorage.app',
  messagingSenderId: '1027251548365',
  appId: '1:1027251548365:web:21b2ea1f38fd4e0229b984',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
