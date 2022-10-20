// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo_3XAnj8RI04RsDwHHfN-z0Q3IZA-bCk",
  authDomain: "parquet-writer.firebaseapp.com",
  projectId: "parquet-writer",
  storageBucket: "parquet-writer.appspot.com",
  messagingSenderId: "592906913581",
  appId: "1:592906913581:web:555537bc3c62d0c826f5a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
export default storage;