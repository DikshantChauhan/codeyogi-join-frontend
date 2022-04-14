import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQxDChc0QARE0HShoEIEvV-AR0q5z_WgY",
  authDomain: "testing-firebase-a3bea.firebaseapp.com",
  projectId: "testing-firebase-a3bea",
  storageBucket: "testing-firebase-a3bea.appspot.com",
  messagingSenderId: "307169928661",
  appId: "1:307169928661:web:38a177aa5d2c701abc495c",
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth();
export default app