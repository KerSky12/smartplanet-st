import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getRemoteConfig, fetchAndActivate, getString } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-remote-config.js";

// 🔴 CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDHYSp8wCzoxo5jZDR9s8QCbvYgvT8mX_M",
  authDomain: "servicio-tecnico-st.firebaseapp.com",
  projectId: "servicio-tecnico-st",
  storageBucket: "servicio-tecnico-st.firebasestorage.app",
  messagingSenderId: "53164445960",
  appId: "1:53164445960:web:38364ef6f3a9e2f8045cbd"
};

// Inicializar Firebase y Firestore globalmente
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db;
window.dbModules = { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy };

// Configuración de Remote Config para contraseñas ocultas
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

async function cargarContrasenas() {
  try {
    await fetchAndActivate(remoteConfig);
    
    // Asignamos las contraseñas a la memoria global desde Firebase
    // Asegúrate de que los nombres coincidan con los parámetros en tu consola de Firebase
    window.CORRECT_PASSWORD = getString(remoteConfig, "correct_password");
    window.ADMIN_PASSWORD = getString(remoteConfig, "admin_password");
    window.INVENTORY_PASSWORD = getString(remoteConfig, "inventory_password");
    
    console.log("Firebase conectado y credenciales seguras cargadas.");
    
    // Arrancamos los listeners de tu app.js
    if(typeof window.initRealtimeListeners === 'function') window.initRealtimeListeners();
    if(typeof window.initInventoryListener === 'function') window.initInventoryListener();
    
  } catch (error) {
    console.error("Error al cargar Remote Config:", error);
  }
}

cargarContrasenas();

// Asegúrate de que esto se ejecute apenas cargue la app
document.addEventListener("DOMContentLoaded", async () => {
    await cargarContrasenas();
    console.log("Sistema listo.");
});