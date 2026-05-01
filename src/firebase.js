import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfnutJQlzdpoywI9c_J7fRPMZgL459kzA",
  authDomain: "niteowl-36241.firebaseapp.com",
  projectId: "niteowl-36241",
  storageBucket: "niteowl-36241.firebasestorage.app",
  messagingSenderId: "1076913770300",
  appId: "1:1076913770300:web:f50d01721b23b158d51839",
  measurementId: "G-V5WLR581TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics if supported
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(console.error);
}

export { analytics };
