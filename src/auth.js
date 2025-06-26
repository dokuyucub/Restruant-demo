// src/auth.js
import { auth } from './firebaseConfig.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Giriş fonksiyonu
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Oturum dinleyici
export function onAuthChange(callback) {
  onAuthStateChanged(auth, user => {
    callback(user);
  });
}

// Çıkış yap
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
}