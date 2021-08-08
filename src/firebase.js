//jshint esversion:6
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyA0gQTA_qlz5zXme1bT7nO9zFfWIyOU6UE",
    authDomain: "netflix-e4859.firebaseapp.com",
    projectId: "netflix-e4859",
    storageBucket: "netflix-e4859.appspot.com",
    messagingSenderId: "899654475309",
    appId: "1:899654475309:web:d47b9bf0adee63500d22a4"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();


  export { auth };
  export default db;