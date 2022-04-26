import { collection, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { authentication, db } from "../../firebase-config";
import { Exam } from "../Models/Exam";
import { answer, Question } from "../Models/Question";
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

export const fetchExamQuestion = async () => {
  if (!authentication.currentUser) return;

  const usersQuestionsCollectionref = collection(db, "users", authentication.currentUser.uid, "questions");
  const questionQuery = query(usersQuestionsCollectionref, where("answer", "==", "null"), limit(1));
  const questionSnapShort = await getDocs(questionQuery);

  const question = questionSnapShort.docs[0].data() as any;
  console.log({ question });
  return question as Question;
};

export const submitExamQuestion = async (answer: answer) => {
  if (!authentication.currentUser) return;

  const usersQuestionsCollectionref = collection(db, "users", authentication.currentUser.uid, "questions");
  const questionQuery = query(usersQuestionsCollectionref, where("answer", "==", "null"), limit(1));
  const questionSnapShort = await getDocs(questionQuery);

  const questionRef = questionSnapShort.docs[0].ref;
  await setDoc(questionRef, { answer: answer }, { merge: true });
};