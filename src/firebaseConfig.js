// src/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2kCpWN6wJ-qaf-6U5WdqiK5cBSSvuFbM",
  authDomain: "qrdemo-4de36.firebaseapp.com",
  projectId: "qrdemo-4de36",
  storageBucket: "qrdemo-4de36.appspot.com",
  messagingSenderId: "305123706543",
  appId: "1:305123706543:web:eb3517d73ad8f3b478f65a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };