import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLfqRZEPkURb7sIOk20suyGZJdRBv00Xo",
  authDomain: "refineit-bc598.firebaseapp.com",
  databaseURL: "https://refineit-bc598-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "refineit-bc598",
  storageBucket: "refineit-bc598.appspot.com",
  messagingSenderId: "425932460051",
  appId: "1:425932460051:web:6ea3430a383bc387e1efe6",
  measurementId: "G-5526DZRM09"
};

initializeApp(firebaseConfig);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
