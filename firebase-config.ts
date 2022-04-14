import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, ApplicationVerifier, RecaptchaVerifier, onAuthStateChanged } from "firebase/auth";

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

export const signIn = (phoneNumber: string, appVerifier: ApplicationVerifier) => {
  return signInWithPhoneNumber(authentication, phoneNumber, appVerifier);
};

export const generateRecaptcha = (containerOrId: string | HTMLElement, success?: (response: any) => void) => {
  return new RecaptchaVerifier(
    containerOrId,
    {
      size: "invisible",
      callback: (response: any) => {
        success && success(response);
      },
    },
    authentication
  );
};

export default app;
