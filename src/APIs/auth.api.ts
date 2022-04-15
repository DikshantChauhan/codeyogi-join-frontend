import { getAuth } from "firebase/auth";
import { collection, DocumentData, DocumentReference, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase-config";

export interface MeUpdateRequest {
  institute_id: number | null;
  discovery_source: any;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  city_of_residence: string;
  "meta.institute": string | null;
  "meta.discoverySource": string | null;
}

export const meUpdateAPI = async (data: MeUpdateRequest) => {
  const currentUser = getAuth().currentUser;
  if (!currentUser) return;

  const usersCollection = query(collection(db, "users"), where("uid", "==", currentUser.uid), limit(1));

  const meDocs: DocumentReference<DocumentData>[] = [];
  (await getDocs(usersCollection)).forEach((doc) => meDocs.push(doc.ref));

  await updateDoc(meDocs[0], data as any);
};
