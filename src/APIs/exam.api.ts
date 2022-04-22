import { collection, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Exam } from "../Models/Exam";
import { User } from "../Models/User";
import { getMeDocRef, isStudentProfileComplete } from "../utils";

export const fetchSelectedExam = async () => {
  const meDocRef = getMeDocRef();

  if (!meDocRef) return;

  const meData = (await getDoc(meDocRef)).data() as User | null;

  if (!(meData && isStudentProfileComplete(meData))) return;

  const examDocsQuery = query(collection(db, "exams"), where("external_id", "==", meData.selected_exam_id!), limit(1));
  const examDocs = await getDocs(examDocsQuery);

  if (examDocs.empty) return;

  const selectedExam = examDocs.docs[0].data() as Exam;

  return selectedExam;
};

export const fetchExamList = async () => {
  const examDocsQuery = query(collection(db, "exams"), where("status", "==", "published"));
  const examDocs = await getDocs(examDocsQuery);

  if (examDocs.empty) return;

  const examList = examDocs.docs.map((examDoc) => examDoc.data() as Exam);

  return examList;
};
