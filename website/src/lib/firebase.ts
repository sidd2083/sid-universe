import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAIoLkMkuaroWxZGS-JX41MowHpu6wfY3Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sidhoni.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sidhoni",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sidhoni.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1032364197448",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1032364197448:web:88b6dd176e3655098b7a7d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HZ6LEW5YR3"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
export const isLiveFirebase = true;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

db = getFirestore(app);
auth = getAuth(app);
storage = getStorage(app);

// Analytics only in browser environment
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported or blocked (e.g. adblocker)
  });
}

export { app, db, auth, storage, analytics };
