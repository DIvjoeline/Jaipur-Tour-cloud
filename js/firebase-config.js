import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDD7FePscA5GTF_jugEY6m95ObZP-CvF20",
    authDomain: "jaipur-tour-cloud.firebaseapp.com",
    projectId: "jaipur-tour-cloud",
    storageBucket: "jaipur-tour-cloud.firebasestorage.app",
    messagingSenderId: "1000301757650",
    appId: "1:1000301757650:web:0214b3029863be8249590b",
    measurementId: "G-D9NEF85HSD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firebaseApp = app;