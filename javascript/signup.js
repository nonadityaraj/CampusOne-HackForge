// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA1U6pqSoNDTplskFS9BqxKrz3fgjzETs4",
    authDomain: "campusone-50263.firebaseapp.com",
    projectId: "campusone-50263",
    storageBucket: "campusone-50263.firebasestorage.app",
    messagingSenderId: "582714629808",
    appId: "1:582714629808:web:ff20a5003d64c50edde575",
    measurementId: "G-WST5508HZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);





//submit
const createAccount = document.querySelector('.signup-btn')
createAccount.addEventListener("click", (e) => {
    e.preventDefault()

    // inputs
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            // alert("creating account")
            window.location.href = "index.html"
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
            // ..
        });
})
