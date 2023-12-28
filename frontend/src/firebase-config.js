import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  getDocs,
  doc,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrCIFUPOPFI9FsAqA83tJIcERmxMeaa_4",
  authDomain: "chat-application-2aef0.firebaseapp.com",
  projectId: "chat-application-2aef0",
  storageBucket: "chat-application-2aef0.appspot.com",
  messagingSenderId: "30472794597",
  appId: "1:30472794597:web:496201f68ff65dad603f0c",
  measurementId: "G-MY83NYX555",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {
  app,
  firestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
};
