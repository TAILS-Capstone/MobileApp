import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  UserCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8osc7aYuWlCq_XbnPcGooghWgRfZBG28",
  authDomain: "tails-7ba18.firebaseapp.com",
  projectId: "tails-7ba18",
  storageBucket: "tails-7ba18.firebasestorage.app",
  messagingSenderId: "254885592893",
  appId: "1:254885592893:web:715874fc803060606c8f54",
  measurementId: "G-Q2K1R5BHR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize analytics only in web environment
let analytics = null;
if (Platform.OS === 'web') {
  analytics = getAnalytics(app);
}

// Set persistence to local storage for web and AsyncStorage for native
if (Platform.OS === 'web') {
  // Firebase web persistence will handle this automatically
} else {
  // For React Native, we'll use AsyncStorage with our own solution in AuthContext
}

// Export our Firebase instances and auth functions
export { 
  auth, 
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  sendPasswordResetEmail,
};

export type { User, UserCredential }; 