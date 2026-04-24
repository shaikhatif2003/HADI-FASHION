// Auth functionality

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const firebaseAuth = window.HADI_FIREBASE?.auth;
const authFeedback = document.getElementById('auth-feedback');
const forgotPasswordBtn = document.getElementById('forgot-password');
let isAuthSubmitting = false;

const setFeedback = (message, type = 'info') => {
  if (!authFeedback) return;
  const icon = type === 'success' ? 'ri-checkbox-circle-line' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
  authFeedback.className = `auth-feedback show ${type}`;
  authFeedback.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
};

const clearFeedback = () => {
  if (!authFeedback) return;
  authFeedback.className = 'auth-feedback';
  authFeedback.innerHTML = '';
};

const setFieldError = (inputId, message = '') => {
  const input = document.getElementById(inputId);
  const field = input?.closest('.auth-field');
  const error = document.getElementById(`${inputId}-error`);

  field?.classList.toggle('has-error', Boolean(message));
  if (error) error.textContent = message;
};

const clearFieldErrors = (form) => {
  form.querySelectorAll('input').forEach((input) => setFieldError(input.id));
};

const setSubmitState = (form, isLoading, label) => {
  const button = form.querySelector('.auth-submit');
  if (!button) return;

  const defaultLabel = button.dataset.defaultLabel || button.querySelector('span')?.textContent || label;
  button.dataset.defaultLabel = defaultLabel;
  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? `<i class="ri-loader-4-line"></i><span>${label}</span>`
    : `<span>${defaultLabel}</span><i class="ri-arrow-right-line"></i>`;
};

const getAuthErrorMessage = (error) => {
  const messages = {
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account exists with this email.',
    'auth/wrong-password': 'Email or password is incorrect.',
    'auth/weak-password': 'Use at least 6 characters for your password.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.'
  };

  return messages[error?.code] || error?.message || 'Something went wrong. Please try again.';
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateLogin = () => {
  let isValid = true;
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!validateEmail(email)) {
    setFieldError('login-email', 'Enter a valid email address.');
    isValid = false;
  }

  if (!password) {
    setFieldError('login-password', 'Enter your password.');
    isValid = false;
  }

  return isValid;
};

const validateSignup = () => {
  let isValid = true;
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (name.length < 2) {
    setFieldError('signup-name', 'Enter your full name.');
    isValid = false;
  }

  if (!validateEmail(email)) {
    setFieldError('signup-email', 'Enter a valid email address.');
    isValid = false;
  }

  if (password.length < 6) {
    setFieldError('signup-password', 'Password must be at least 6 characters.');
    isValid = false;
  }

  return isValid;
};

const updatePasswordMeter = () => {
  const input = document.getElementById('signup-password');
  const meter = document.getElementById('password-meter');
  if (!input || !meter) return;

  const password = input.value;
  meter.className = 'password-meter';
  if (!password) return;

  const score = [
    password.length >= 6,
    /[A-Z]/.test(password) || /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password) || password.length >= 10
  ].filter(Boolean).length;

  meter.classList.add(score >= 3 ? 'strong' : score === 2 ? 'medium' : 'weak');
};

const syncSession = async (firebaseUser, name) => {
  const token = await firebaseUser.getIdToken(true);
  const data = await HADI.apiCall('/auth/sync', {
    method: 'POST',
    headers: { 'x-auth-token': token },
    body: JSON.stringify({ name })
  }, { silent: true });

  if (!data?.user) {
    throw new Error('Could not sync your account. Please try again.');
  }

  HADI.setAuth(data.token || token, data.user);
  return data.user;
};

document.querySelectorAll('[data-toggle-password]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.togglePassword);
    if (!input) return;

    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    button.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    button.innerHTML = `<i class="${isHidden ? 'ri-eye-off-line' : 'ri-eye-line'}"></i>`;
  });
});

document.querySelectorAll('.auth-card input').forEach((input) => {
  input.addEventListener('input', () => {
    setFieldError(input.id);
    clearFeedback();
  });
});

document.getElementById('signup-password')?.addEventListener('input', updatePasswordMeter);

firebaseAuth?.onAuthStateChanged((user) => {
  if (user && (loginForm || signupForm) && !isAuthSubmitting) {
    window.location.href = 'index.html';
  }
});

forgotPasswordBtn?.addEventListener('click', async () => {
  clearFeedback();
  setFieldError('login-email');

  if (!firebaseAuth) {
    setFeedback('Firebase Auth is not available. Check the Firebase scripts and configuration.', 'error');
    return;
  }

  const email = document.getElementById('login-email').value.trim();
  if (!validateEmail(email)) {
    setFieldError('login-email', 'Enter your email first.');
    return;
  }

  try {
    forgotPasswordBtn.disabled = true;
    forgotPasswordBtn.textContent = 'Sending...';
    await firebaseAuth.sendPasswordResetEmail(email);
    setFeedback('Password reset email sent. Check your inbox.', 'success');
  } catch (error) {
    console.error('Password reset error:', error);
    setFeedback(getAuthErrorMessage(error), 'error');
  } finally {
    forgotPasswordBtn.disabled = false;
    forgotPasswordBtn.textContent = 'Forgot password?';
  }
});

if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    clearFeedback();
    clearFieldErrors(loginForm);

    if (!validateLogin()) return;

    if (!firebaseAuth) {
      setFeedback('Firebase Auth is not available. Check the Firebase scripts and configuration.', 'error');
      return;
    }

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      isAuthSubmitting = true;
      setSubmitState(loginForm, true, 'Signing in...');
      setFeedback('Checking your credentials...', 'info');
      const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      await syncSession(credential.user);

      setFeedback('Login successful. Redirecting...', 'success');
      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 450);
    } catch (error) {
      isAuthSubmitting = false;
      console.error('Login error:', error);
      setFeedback(getAuthErrorMessage(error), 'error');
      setSubmitState(loginForm, false);
    }
  };
}

if (signupForm) {
  signupForm.onsubmit = async (e) => {
    e.preventDefault();
    clearFeedback();
    clearFieldErrors(signupForm);

    if (!validateSignup()) return;

    if (!firebaseAuth) {
      setFeedback('Firebase Auth is not available. Check the Firebase scripts and configuration.', 'error');
      return;
    }

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value.trim();

    try {
      isAuthSubmitting = true;
      setSubmitState(signupForm, true, 'Creating account...');
      setFeedback('Creating your account...', 'info');
      const credential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName: name });
      await syncSession(credential.user, name);

      setFeedback('Account created. Redirecting...', 'success');
      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 450);
    } catch (error) {
      isAuthSubmitting = false;
      console.error('Signup error:', error);
      setFeedback(getAuthErrorMessage(error), 'error');
      setSubmitState(signupForm, false);
    }
  };
}
