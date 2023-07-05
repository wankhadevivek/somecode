importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js"
); // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

firebase.initializeApp({
  apiKey: "AIzaSyC-eG_Zlki3LtoWk98g02X4GX0w8tWJ-RE",
  authDomain: "angularnotify-f5b3e.firebaseapp.com",
  projectId: "angularnotify-f5b3e",
  storageBucket: "angularnotify-f5b3e.appspot.com",
  messagingSenderId: "633879184293",
  appId: "1:633879184293:web:75e23a4e48dcff55709e4c",
  measurementId: "G-VBZS8KNLER",
});

const messaging = firebase.messaging();
