let firebaseReady = false;

  const firebaseConfig = {
    apiKey: "AIzaSyDQoLPv834S2TbBw6pM5aECLRribzgnNdU",
    authDomain: "projects-6c49a.firebaseapp.com",
    databaseURL: "https://projects-6c49a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "projects-6c49a",
    storageBucket: "projects-6c49a.firebasestorage.app",
    messagingSenderId: "770504051582",
    appId: "1:770504051582:web:5f957e6aa8a93b63ea012f",
    measurementId: "G-BGPNPLJYSV"
  };

if (window.firebase && !window.firebase.apps.length) {
  window.firebase.initializeApp(firebaseConfig);
}

if (window.firebase?.analytics) {
  try {
    window.firebase.analytics();
  } catch (error) {
    console.warn('Firebase analytics unavailable:', error.message);
  }
}

// Mark Firebase as ready
firebaseReady = true;

window.HADI_FIREBASE = {
  config: firebaseConfig,
  app: window.firebase?.app?.() || null,
  auth: window.firebase?.auth?.() || null,
  isReady: () => firebaseReady && window.firebase?.auth?.()?.currentUser !== undefined
};
