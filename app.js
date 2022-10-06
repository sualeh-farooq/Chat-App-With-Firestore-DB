import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword
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
let signupName = document.getElementById('signupName')
let signupEmail = document.getElementById('signupEmail')
let signupCity = document.getElementById('signupCity')
let signupNum = document.getElementById('signupNum')
let signupPass = document.getElementById('signupPass')

let nameReg = /^[a-zA-Z]+[a-zA-Z]+$/;
let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    // let nameReg = /^[a-zA-Z ]*$/
let numReg = /^[\+]?[(]?[0-9]{4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,5}$/


const regBtn = document.getElementById('register-btn')

window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(`User is Sign In`, user)
            window.location.href = '/pages/profile.html'
        } else if (!user) {
            // window.location.href = '/index.html'
            console.log(`User Sign Out`)
        }
    })
}



regBtn.addEventListener('click', () => {
    if (signupName.value) {
        if (emailReg.test(signupEmail.value)) {
            if (signupCity.value.trim() != "") {
                if (numReg.test(signupNum.value)) {
                    if (signupPass.value > 8) {
                        swal("Good job!", "You clicked the button!", "success");

                        createUserWithEmailAndPassword(auth, signupEmail.value, signupPass.value)
                            .then((userCredential) => {
                                const user = userCredential.user
                                console.log('UserSucessfully Registered ', user)

                            })
                            .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                console.log(`error ==> ${errorMessage}`)

                            })

                    } else {
                        swal("Invalid Password", "Password Must contains 8 Characters", "error");

                    }
                } else {
                    swal("Invalid Number", "Enter Your Number Correctly", "error");

                }
            } else {
                swal("City Missing", "Enter Your City", "info")
            }
        } else {
            swal("Invalid Email", "Type Your Email Correctly", "error");
        }
    } else {
        swal("Invalid Name", "Type Your Name Correctly", "error");
    }
})