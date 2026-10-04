import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBwFUhEu-NLQssE2p7aVZWtFjQmf0JzESk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "javi-group-portfolio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "javi-group-portfolio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "javi-group-portfolio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "485428804960",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:485428804960:web:378f54772787109c15f205",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TM1V63YSQW",
};

// Singleton Firebase App initialization
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Authentication service instance
export const auth: Auth = getAuth(app);

// Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

// Analytics (safely initialized in browser environment)
let analyticsInstance: Analytics | null = null;
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window !== "undefined" && !analyticsInstance) {
    try {
      const { getAnalytics, isSupported } = await import("firebase/analytics");
      if (await isSupported()) {
        analyticsInstance = getAnalytics(app);
      }
    } catch (e) {
      console.warn("Firebase analytics initialization skipped:", e);
    }
  }
  return analyticsInstance;
}
