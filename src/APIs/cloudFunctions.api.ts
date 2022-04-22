import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase-config";

export const scheduleTest = httpsCallable(functions, "scheduleTest");
export const test = httpsCallable(functions, "test");
