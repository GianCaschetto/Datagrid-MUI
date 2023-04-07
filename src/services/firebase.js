
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyNc_nWmxOT7Bq6tQKIcH5OpFbmqoYT6M",
  authDomain: "datagrid-mui-practice.firebaseapp.com",
  projectId: "datagrid-mui-practice",
  storageBucket: "datagrid-mui-practice.appspot.com",
  messagingSenderId: "6175320341",
  appId: "1:6175320341:web:a8c43a13b8baa98b55a11c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db}