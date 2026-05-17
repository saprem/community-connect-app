// Firebase Configuration
// STEP 1: Replace these values with your Firebase project credentials
// Get from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Import Firebase services
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  // Check if we have valid credentials (not placeholder values)
  const hasValidConfig =
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID";

  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);

    // Initialize Auth with AsyncStorage persistence for React Native
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

    db = getFirestore(app);
    storage = getStorage(app);

    console.log('✅ Firebase initialized successfully');
  } else {
    console.log('⚠️ Firebase not configured - using mock mode');
    console.log('📝 Please add your Firebase credentials to .env or firebase.config.ts');

    // Mock objects for development without Firebase
    auth = null;
    db = null;
    storage = null;
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };
export default app;
