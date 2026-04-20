// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFrw3iaKp157xumWQ873HS0stGQUKzKVc",
  authDomain: "accessible-vision-society.firebaseapp.com",
  databaseURL: "https://accessible-vision-society-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "accessible-vision-society",
  storageBucket: "accessible-vision-society.firebasestorage.app",
  messagingSenderId: "236524839075",
  appId: "1:236524839075:web:e97633ef4802f224f09f16",
  measurementId: "G-9JPL1JDZZY"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Safely export services if they are loaded
let auth, db, announcementsRef;

if (typeof firebase.auth === 'function') {
    auth = firebase.auth();
}

if (typeof firebase.database === 'function') {
    db = firebase.database();
    announcementsRef = db.ref('announcements');
}
