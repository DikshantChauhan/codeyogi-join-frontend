import { ApplicationVerifier, signInWithPhoneNumber, signOut as firebaseSignout } from "firebase/auth";
import { getDoc, updateDoc } from "firebase/firestore";
import { authentication } from "../../firebase-config";
import { User } from "../Models/User";
import { getMeDocRef } from "../utils";

export const meFetchAPI = async () => {
  const meDocRef = getMeDocRef();

  if (!meDocRef) return;

  const meDoc = await getDoc(meDocRef);
  const meData = meDoc.data() as User | undefined;

  if (!meData) return undefined;

  if (typeof meData.phone_no === "string") {
    const phone_no = meData.phone_no.replace("+91", "");

    return { ...meData, phone_no };
  }

  return meData;
};

export const meUpdateAPI = async (data: Partial<User>) => {
  const meDocRef = getMeDocRef();

  if (!meDocRef) return;

  await updateDoc(meDocRef, data as any);

  const meDoc = await getDoc(meDocRef);

  return meDoc.data() as User | undefined;
};

export const signInAPI = (phoneNumber: string, appVerifier: ApplicationVerifier) => {
  return signInWithPhoneNumber(authentication, phoneNumber, appVerifier);
};

export const signOutAPI = () => {
  return firebaseSignout(authentication);
};
