import { ApplicationVerifier, getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut as firebaseSignout } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../../firebase-config";
import { User } from "../Models/User";

export interface MeUpdateRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_no: number;
  institute_name: string;
  city_of_residence: string;
  discovery_source: string;
}

const auth = getAuth();

export const meFetchAPI = async (id: string) => {
  const meDocRef = doc(db, "users", id);
  const meDoc = await getDoc(meDocRef);
  const meData = meDoc.data() as User | undefined;

  if (!meData) return undefined;

  if (typeof meData.phone_no === "string") {
    const phone_no = meData.phone_no.replace("+91", "");

    return { ...meData, phone_no };
  }

  return meData;
};

export const meUpdateAPI = async (data: MeUpdateRequest) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const meDocRef = doc(db, "users", currentUser.uid);

  await updateDoc(meDocRef, data as any);

  const meDoc = await getDoc(meDocRef);

  return meDoc.data() as User | undefined;
};

export const signIn = (phoneNumber: string, appVerifier: ApplicationVerifier) => {
  return signInWithPhoneNumber(authentication, phoneNumber, appVerifier);
};

export const signOut = () => {
  return firebaseSignout(auth);
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
