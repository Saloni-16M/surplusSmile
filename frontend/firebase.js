// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6G27gxB3oJL9lTcw5Xnp6zSdQSWEm6To",
  authDomain: "surplussmile-158af.firebaseapp.com",
  projectId: "surplussmile-158af",
  storageBucket: "surplussmile-158af.firebasestorage.app",
  messagingSenderId: "945946962139",
  appId: "1:945946962139:web:b986de2d90a1ee08f984fe",
  measurementId: "G-M698MSS8TL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// 👇 This must be exported like this
const messaging = getMessaging(app);
export { messaging };
