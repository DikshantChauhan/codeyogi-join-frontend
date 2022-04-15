// import { getAuth } from "firebase/auth";
import { collection, DocumentData, DocumentReference, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase-config";

export interface MeUpdateRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  institute_name: string;
  city_of_residence: string;
  discovery_source: string;
}

export const meUpdateAPI = async (data: MeUpdateRequest) => {
  // const currentUser = getAuth().currentUser;
  // if (!currentUser) return;
  const usersCollection = query(collection(db, "users"), where("uid", "==", "a6sd1ca6s5df165sd1f"), limit(1));

  const meDocs: DocumentReference<DocumentData>[] = [];
  (await getDocs(usersCollection)).forEach((doc) => meDocs.push(doc.ref));

  await updateDoc(meDocs[0], data as any);
};
