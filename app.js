import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";


import {
    doc,
    setDoc,
    getFirestore,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";



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
const db = getFirestore()
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
            console.log(`User Sign Out`)
        }
    })
}


// Registration using Regex
regBtn.addEventListener('click', async() => {
    if (signupName.value) {
        if (emailReg.test(signupEmail.value)) {
            if (signupCity.value.trim() != "") {
                if (numReg.test(signupNum.value)) {
                    if (signupPass.value > 8) {

                        //Added email to the authentication
                        createUserWithEmailAndPassword(auth, signupEmail.value, signupPass.value)
                            .then(async(userCredential) => {
                                const user = userCredential.user

                                //Setting Data in firestore database
                                await setDoc(doc(db, "users", user.uid), {
                                    name: signupName.value,
                                    email: signupEmail.value,
                                    city: signupCity.value,
                                    uid: user.uid
                                });
                                console.log('UserSucessfully Registered ', user)
                                swal("Sucesfully Registered", "", "success");
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


//showing the friends 
async function showFriends(name, uid) {
    const citiesRef = collection(db, "users");
    const q = query(citiesRef, where("name", "!=", name));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data().name);
        let users = document.getElementById('users')
        users.innerHTML += ` <li> ${doc.data().name} <button id='chat-btn' onclick= 'startChat("${doc.id}","${doc.data().name}","${name}","${uid}")'> Start Chat </button> </li>`
    })

}

let unsubscribe;
//Start Chat function
async function startChat(friendId, friendName, currentName, uid) {
    if (unsubscribe) {
        unsubscribe()
    }
    let chatWith = document.getElementById("chat-with");
    chatWith.innerHTML = friendName;
    let send = document.getElementById('send')
    let message = document.getElementById('message')

    let chatid;
    //Creating New ID for collection of messages in database
    if (friendId < uid) {
        chatid = `${friendId}${uid}`
    } else {
        chatid = `${uid}${friendId}`
    }
    console.log(chatid)

    //loading all chats b/w two friends
    loadChats(chatid)
    send.addEventListener('click', async() => {
        let allMessages = document.getElementById("all-messages");
        allMessages.innerHTML = "";
        await addDoc(collection(db, "messages"), {
            senderName: currentName,
            senderId: uid,
            receiverName: friendName,
            receiverId: friendId,
            chat_id: chatid,
            message: message.value
        });
    })
}


const loadChats = (chatID) => {

    const q = query(collection(db, "messages"), where("chat_id", "==", chatID));
    let allMessages = document.getElementById("all-messages");
    unsubscribe = onSnapshot(q, (querySnapshot) => {
        allMessages.innerHTML = "";
        querySnapshot.forEach((doc) => {
            allMessages.innerHTML += `<li> ${doc.data().senderName} :  ${doc.data().message}</li>`;
        });
    });
}