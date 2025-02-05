// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi-Wl0F4xF6tAKUJ014Tz-9S7rC6_uwis",
  authDomain: "my-postmanager.firebaseapp.com",
  projectId: "my-postmanager",
  storageBucket: "my-postmanager.firebasestorage.app",
  messagingSenderId: "534068017602",
  appId: "1:534068017602:web:d98a6044a5023cc5c3fe5b",
  measurementId: "G-CYRN461ELR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
