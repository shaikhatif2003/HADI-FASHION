// HADI Fashion Frontend Main JS
// API Base URL
const API_BASE = '/api';

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
const loadingEl = document.getElementById('loading');
let resolveAuthReady = () => {};
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

// Utils
const showLoading = () => {
  if (loadingEl) loadingEl.style.display = 'block';
};

const hideLoading = () => {
  if (loadingEl) loadingEl.style.display = 'none';
};

const apiCall = async (endpoint, options = {}, config = {}, retryCount = 0) => {
  showLoading();
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    hideLoading();
    
    // Handle 401 - token expired, try to refresh
    if (res.status === 401 && retryCount === 0) {
      console.warn('Got 401, attempting token refresh...');
      const currentUser = window.HADI_FIREBASE?.auth?.currentUser;
      
      if (currentUser) {
        try {
          const newToken = await currentUser.getIdToken(true);
          console.log('Token refreshed successfully');
          localStorage.setItem('token', newToken);
          options.headers = { ...options.headers, 'x-auth-token': newToken };
          return apiCall(endpoint, options, config, 1); // Retry once
        } catch (err) {
          console.error('Token refresh failed:', err);
          logout();
          return null;
        }
      }
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.msg || errorJson.error || errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP ${res.status}`);
      }
    }
    return res.json();
  } catch (err) {
    hideLoading();
    console.error(err);
    if (!config.silent) {
      alert(err.message);
    }
    return null;
  }
};

const goToPage = (path) => {
  window.location.href = path;
};

const goToProduct = (productId) => {
  if (!productId) return;
  goToPage(`product.html?id=${encodeURIComponent(productId)}`);
};

// Auth Utils
const getToken = () => localStorage.getItem('token');
const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const logout = async () => {
  if (window.HADI_FIREBASE?.auth?.currentUser) {
    await window.HADI_FIREBASE.auth.signOut();
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
};

const syncUserFromServer = async (token) => {
  const data = await apiCall('/auth/me', {
    headers: { 'x-auth-token': token }
  }, { silent: true });

  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
};

// Load cart count
const updateCartCount = async () => {
  if (!getUser()) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartCountEl) {
      cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    return;
  }
  const cart = await apiCall('/cart', {
    headers: { 'x-auth-token': getToken() }
  });
  if (cartCountEl && cart?.items) {
    cartCountEl.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
};

const initFirebaseAuthSync = () => {
  if (!window.HADI_FIREBASE?.auth) {
    console.warn('Firebase Auth not available');
    resolveAuthReady();
    updateCartCount();
    return;
  }

  window.HADI_FIREBASE.auth.onAuthStateChanged(async (firebaseUser) => {
    if (!firebaseUser) {
      console.log('No Firebase user, clearing auth');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      resolveAuthReady();
      updateCartCount();
      return;
    }

    console.log('Firebase user detected, getting fresh token...');
    try {
      const token = await firebaseUser.getIdToken(true); // Force fresh
      console.log('Got fresh token');
      localStorage.setItem('token', token);

      const currentUser = getUser();
      if (!currentUser || currentUser.id !== firebaseUser.uid) {
        console.log('Syncing user from server');
        await syncUserFromServer(token);
      }
    } catch (error) {
      console.error('Auth sync error:', error);
    }

    resolveAuthReady();
    updateCartCount();
  });
};

// Product rendering
const renderProducts = (products, container) => {
  container.innerHTML = products.map(p => `
    <div class="product-card" onclick="HADI.goToProduct('${p.id ?? p._id}')">
      <div class="product-image">${p.category.charAt(0).toUpperCase()}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        ${p.discount > 0 ? `<span class="discount-badge">${p.discount}% OFF</span>` : ''}
        <div class="product-price">$${p.price}</div>
      </div>
    </div>
  `).join('');
};

// Init on load
document.addEventListener('DOMContentLoaded', initFirebaseAuthSync);

// Export for other scripts
window.HADI = {
  apiCall,
  getToken,
  getUser,
  setAuth,
  logout,
  goToPage,
  goToProduct,
  waitForAuth: () => authReady,
  updateCartCount,
  renderProducts
};

