// js/firebase/config.js
// إعدادات Firebase — استبدلي القيم التالية ببيانات مشروعك من Firebase Console
// Project Settings > General > Your apps > SDK setup and configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_3p10YQbixKcQ6ApPPNRcOytW7e3uSHM",
  authDomain: "furqan-reports.firebaseapp.com",
  projectId: "furqan-reports",
  storageBucket: "furqan-reports.firebasestorage.app",
  messagingSenderId: "782854377950",
  appId: "1:782854377950:web:850abdf27ca2fad7444d4f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
