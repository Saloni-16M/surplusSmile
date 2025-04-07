import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB6G27gxB3oJL9lTcw5Xnp6zSdQSWEm6To",
    authDomain: "surplussmile-158af.firebaseapp.com",
    projectId: "surplussmile-158af",
    storageBucket: "surplussmile-158af.firebasestorage.app",
    messagingSenderId: "945946962139",
    appId: "1:945946962139:web:b986de2d90a1ee08f984fe",
    measurementId: "G-M698MSS8TL"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
