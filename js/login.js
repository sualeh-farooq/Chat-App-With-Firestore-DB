import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";



const firebaseConfig = {
    apiKey: "AIzaSyCAZuDsUDZZwE4ecSqRq4cw3zTxVKdPHnw",
    authDomain: "authentication-dddf0.firebaseapp.com",
    projectId: "authentication-dddf0",
    storageBucket: "authentication-dddf0.appspot.com",
    messagingSenderId: "553708524806",
    appId: "1:553708524806:web:d80abe7f360dfef7b4fa87"
}


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

let loginBtn = document.getElementById(`login-btn`)

loginBtn.addEventListener('click', login)

function login() {
    let email = document.getElementById('loginEmail').value
    let password = document.getElementById('loginPass').value
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('User Login', user)

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)


            if (errorMessage === `Firebase: Error (auth/invalid-email).`) {
                swal("Invalid Email", "Type Your Email Correctly", "error");
            }
            if (errorMessage === `Firebase: Error (auth/internal-error).`) {
                swal("Invalid Login Credentials", " ", "error")
            }

            if (errorMessage === `Firebase: Error (auth/wrong-password).`) {
                swal('Wrong Password', "", "error")
            }

            if (errorMessage === `Firebase: Error (auth/user-not-found).`) {
                swal('User Not Found', "Please Register Yourself First", 'error')
            }
        });
}


window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(`User is Sign In`, user)
            window.location.href = '/pages/profile.html'
        } else if (!user) {
            console.log(`User Sign Out`)
        }
    })
}