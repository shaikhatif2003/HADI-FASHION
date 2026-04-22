let firebaseReady = false;

const firebaseConfig = {
  apiKey: 'AIzaSyDzLRZyfMweM56D4tcxFUMciu-NE4lTXbM',
  authDomain: 'hadi-fashion.firebaseapp.com',
  projectId: 'hadi-fashion',
  storageBucket: 'hadi-fashion.firebasestorage.app',
  messagingSenderId: '865463449167',
  appId: '1:865463449167:web:33fbeec903e45a08469c3a',
  measurementId: 'G-QJBDY4X4YB'
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
