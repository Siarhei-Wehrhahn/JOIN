import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB29zCfFy7WJQ4aK96vxUCZDlEFcE6PTA0",
    authDomain: "join-bf706.firebaseapp.com",
    projectId: "join-bf706",
    storageBucket: "join-bf706.appspot.com",
    messagingSenderId: "98911497254",
    appId: "1:98911497254:web:862a193b6d07dcbbe14ae7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
