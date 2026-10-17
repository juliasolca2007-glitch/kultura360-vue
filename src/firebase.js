import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7yE0nuDFcMTF7tbMAiUAs5mT4uXXGDao",
  authDomain: "kultura360-vue-julia.firebaseapp.com",
  projectId: "kultura360-vue-julia",
  storageBucket: "kultura360-vue-julia.firebasestorage.app",
  messagingSenderId: "644591719110",
  appId: "1:644591719110:web:9ae034af09cb76d95f7dc7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
