import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";


import {
    doc,
    getFirestore,
    getDoc,

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


let logOut = document.getElementById(`logout-btn`)

//Logout Button 
logOut.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log(`Sign Out Sucessful`)
    }).catch((error) => {
        console.log(`error==> ${error}`)
    });
})



window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(`User is Sign In`, user)
            getData(user)
        } else if (!user) {
            window.location.href = '/pages/login.html'
            console.log(`User Sign Out`)
        }
    })
}




const getData = async(user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        console.log(docSnap.data().email)
        let self = document.getElementById('current-user')
        self.innerHTML = ` Current User :  <b> ${docSnap.data().name}</b>`
            // showFriends(docSnap.data().name, user.uid, docSnap.data().email)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}