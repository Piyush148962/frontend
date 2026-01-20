// src/firebase.js
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

// -----------------------------------------
// FIREBASE CONFIG (YOURS)
// -----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBcg0Y9on7LtLpkt4SRs3HQNfCOCEaGQpg",
  authDomain: "frontend-7ad75.firebaseapp.com",
  projectId: "frontend-7ad75",
  storageBucket: "frontend-7ad75.firebasestorage.app",
  messagingSenderId: "581940184344",
  appId: "1:581940184344:web:b704d9078e045494360a6d",
  measurementId: "G-BGFXHGLMD2"
};

// -----------------------------------------
// INIT
// -----------------------------------------
const app = initializeApp(firebaseConfig);

// -----------------------------------------
// AUTH SETUP
// -----------------------------------------
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ------- GOOGLE LOGIN -------
export function signInWithGooglePopup() {
  return signInWithPopup(auth, googleProvider);
}

// ------- SIGN UP -------
export function emailSignUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// ------- EMAIL LOGIN (FIXED!!) -------
export function emailSignIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// ------- LOGOUT -------
export function signOutFirebase() {
  return signOut(auth);
}

// ------- AUTH LISTENER -------
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// -----------------------------------------
// FIRESTORE
// -----------------------------------------
export const db = getFirestore(app);

// Make timestamp available
export { serverTimestamp };
