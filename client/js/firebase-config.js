let firebaseReady = false;

  const firebaseConfig = {
    apiKey: "AIzaSyCigBtLmEYpbDOKgKQ7n3HwCImHGIkz2Ig",
    authDomain: "bcanotes-ecbac.firebaseapp.com",
    projectId: "bcanotes-ecbac",
    storageBucket: "bcanotes-ecbac.firebasestorage.app",
    messagingSenderId: "329332716671",
    appId: "1:329332716671:web:3294c49b8743dcb0487b4a",
    measurementId: "G-7YTCMT1LCR"
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
