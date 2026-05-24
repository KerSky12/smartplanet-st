import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 🔴 CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDHYSp8wCzoxo5jZDR9s8QCbvYgvT8mX_M",
  authDomain: "servicio-tecnico-st.firebaseapp.com",
  projectId: "servicio-tecnico-st",
  storageBucket: "servicio-tecnico-st.firebasestorage.app",
  messagingSenderId: "53164445960",
  appId: "1:53164445960:web:38364ef6f3a9e2f8045cbd"
};

// Inicializar Firebase, Firestore y Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar funciones globalmente para que index.html las pueda usar
window.db = db;
window.auth = auth;
window.dbModules = { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy };
window.signInWithEmailAndPassword = signInWithEmailAndPassword;

// Función global que consulta la clave secreta a Firestore
window.obtenerClaveSegura = async function(nombreClave) {
    try {
        console.log("--- BUSCANDO CLAVE ---");
        // Aseguramos la ruta completa
        const docRef = doc(db, "configuracion", "claves");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Datos del documento encontrados:", data);
            
            // Accedemos al valor. OJO: si el campo en Firestore está escrito 
            // como 'admin_password', aquí se debe leer igual.
            const valor = data[nombreClave]; 
            
            if (valor === undefined) {
                console.error("El campo '" + nombreClave + "' no existe dentro del documento 'claves'. Revisa que se llame idéntico.");
                return null;
            }
            
            return valor;
        } else {
            console.error("ERROR: No se encontró el documento 'claves' en la colección 'configuracion'.");
            return null;
        }
    } catch (e) {
        console.error("ERROR CRÍTICO AL LEER FIRESTORE:", e);
        return null;
    }
};

// Arrancamos los listeners de la base de datos
if(typeof window.initRealtimeListeners === 'function') window.initRealtimeListeners();
if(typeof window.initInventoryListener === 'function') window.initInventoryListener();