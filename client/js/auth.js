// Auth functionality

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const firebaseAuth = window.HADI_FIREBASE?.auth;

const syncSession = async (firebaseUser, name) => {
  try {
    // Force refresh token to ensure it's fresh
    const token = await firebaseUser.getIdToken(true);
    console.log('Got fresh token for sync');
    
    const data = await HADI.apiCall('/auth/sync', {
      method: 'POST',
      headers: { 'x-auth-token': token },
      body: JSON.stringify({ name })
    });

    if (!data?.user) {
      return null;
    }

    HADI.setAuth(data.token || token, data.user);
    return data.user;
  } catch (error) {
    console.error('Sync session error:', error);
    throw error;
  }
};

if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!firebaseAuth) {
      alert('Firebase Auth is not available.');
      return;
    }

    try {
      const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      console.log('Login successful, syncing session...');
      const user = await syncSession(credential.user);
      if (!user) return;

      alert('Login successful!');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };
}

if (signupForm) {
  signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;

    if (!firebaseAuth) {
      alert('Firebase Auth is not available.');
      return;
    }

    try {
      const credential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName: name });

      console.log('Signup successful, syncing session...');
      const user = await syncSession(credential.user, name);
      if (!user) return;

      alert('Signup successful!');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message);
    }
  };
}

