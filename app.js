import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elementos del DOM
const userInfo = document.getElementById("userInfo");
const loginSection = document.getElementById("loginSection");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

// Login con Google
window.login = async function () {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
};

// Logout
window.logout = async function () {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

// Estado de autenticación
onAuthStateChanged(auth, user => {
    if (user) {
        userInfo.style.display = "block";
        loginSection.style.display = "none";
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;
    } else {
        userInfo.style.display = "none";
        loginSection.style.display = "block";
    }
});

// Guardar dato
window.guardarDato = async function () {
    const input = document.getElementById("dataInput");
    const valor = input.value;

    if (!valor) {
        alert("Por favor ingresa un dato.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión.");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "pruebas"), {
            dato: valor,
            userId: user.uid,
            userEmail: user.email,
            timestamp: new Date()
        });
        alert(`Dato guardado con ID: ${docRef.id}`);
        input.value = "";
    } catch (e) {
        console.error("Error al guardar en Firebase:", e);
    }
};
