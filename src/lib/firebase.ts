import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-L6ZL8STBEY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable auth emulator in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

export const analytics = getAnalytics(app);

// Add authorized domains
const authorizedDomains = [
  'localhost',
  '127.0.0.1',
  'stackblitz.com',
  'webcontainer.io',
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
];

// Configure authorized domains
auth.config.authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
auth.config.apiHost = `https://${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`;