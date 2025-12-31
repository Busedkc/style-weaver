// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvClGPKMWw3m0WQ8P83rQvA6apbWvxI0w",
  authDomain: "stylemirror-7a5bf.firebaseapp.com",
  projectId: "stylemirror-7a5bf",
  storageBucket: "stylemirror-7a5bf.firebasestorage.app",
  messagingSenderId: "1079920126462",
  appId: "1:1079920126462:web:bbf6d37379497af2f638af",
  measurementId: "G-PMHCQSPFCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };

