
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
