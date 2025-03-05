import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCX5W0KeJEyZAIGlP1eK_gNG_soqsN90wU",
  authDomain: "storyapp-000.firebaseapp.com",
  projectId: "storyapp-000",
  storageBucket: "storyapp-000.firebasestorage.app",
  messagingSenderId: "12223886704",
  appId: "1:12223886704:web:d61317cc5a7c3f6ff58bb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
