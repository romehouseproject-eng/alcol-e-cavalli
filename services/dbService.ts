
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

/**
 * --- GUIDA ALLA CONFIGURAZIONE FIREBASE ---
 * 
 * 1. Vai su https://console.firebase.google.com/
 * 2. Clicca su "Aggiungi progetto" e segui i passaggi.
 * 3. Nella dashboard del progetto, clicca sull'icona </> (Web) per registrare l'app.
 * 4. Copia l'oggetto "firebaseConfig" che ti viene mostrato e sostituisci i valori qui sotto.
 * 5. IMPORTANTE: Nel menu a sinistra di Firebase, vai su "Realtime Database", 
 *    clicca su "Crea database" (scegli Europa come località) e poi 
 *    nella tab "Regole" imposta "read" e "write" a true per i test.
 */

const firebaseConfig = {
  apiKey: "AIzaSyAbzCO-CQhAFWBiDWN7m-QkljSlZ78oHzA", 
  authDomain: "holopad-4d752.firebaseapp.com",
  databaseURL: https://holopad-4d752-default-rtdb.europe-west1.firebasedatabase.app, // <--- Molto importante per la sincronizzazione
  projectId: "holopad-4d752",
  storageBucket: "holopad-4d752.firebasestorage.app",
  messagingSenderId: "252435766194",
  appId: "1:252435766194:web:7be38bdecf437d99f762ab"
};

// Inizializzazione Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const dbService = {
  // Ascolta i cambiamenti in tempo reale (permette a tutti di vedere i voti che entrano)
  subscribeToData: (callback: (data: any) => void) => {
    const dataRef = ref(db, 'contest_data');
    return onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });
  },

  // Salva l'intero stato (usato dall'admin per sbloccare serate o nascondere cantanti)
  saveAllData: async (data: any) => {
    return set(ref(db, 'contest_data'), data);
  },

  // Aggiorna solo i voti (usato quando un utente clicca su "Invia Trasmissione")
  updateVotes: async (votes: any, progress: any) => {
    return update(ref(db, 'contest_data'), { 
      votes, 
      votersProgress: progress 
    });
  },

  // Cambia impostazioni come i blocchi delle classifiche
  updateSettings: async (settings: any) => {
    return update(ref(db, 'contest_data'), settings);
  }
};
