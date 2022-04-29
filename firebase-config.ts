import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmBz-KXZKv260bhBiuK2A1AoZ1nrFHgQ8",
  authDomain: "join-codeyogi-446f2.firebaseapp.com",
  projectId: "join-codeyogi-446f2",
  storageBucket: "join-codeyogi-446f2.appspot.com",
  messagingSenderId: "241660830558",
  appId: "1:241660830558:web:f5ec7c1a7eb511abe7e5cf",
  measurementId: "G-6LFH61ZJBD",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const functions = getFunctions(app);
export const authentication = getAuth(app);

if (import.meta.env.VITE_NODE_ENV !== "production") {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectFirestoreEmulator(db, "localhost", 8888);
  connectAuthEmulator(authentication, "http://localhost:9099");
}

export default app;
