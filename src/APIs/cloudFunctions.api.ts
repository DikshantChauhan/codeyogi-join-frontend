import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase-config";

export const scheduleTestAPI = httpsCallable(functions, "schedule_test");
