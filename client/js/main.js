// HADI Fashion Frontend Main JS
// API Base URL
const API_BASE = '/api';

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
let activeLoaderRequests = 0;
let loaderHideTimer = null;
let resolveAuthReady = () => {};
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

// Utils
const getLoadingEl = () => document.getElementById('loading');

const showLoading = () => {
  const loadingEl = getLoadingEl();
  activeLoaderRequests += 1;
  if (!loadingEl) return;

  if (loaderHideTimer) {
    clearTimeout(loaderHideTimer);
    loaderHideTimer = null;
  }

  loadingEl.style.display = 'block';
  loadingEl.setAttribute('aria-busy', 'true');
};

const hideLoading = () => {
  const loadingEl = getLoadingEl();
  activeLoaderRequests = Math.max(0, activeLoaderRequests - 1);
  if (!loadingEl || activeLoaderRequests > 0) return;

  loaderHideTimer = setTimeout(() => {
    if (activeLoaderRequests === 0) {
      loadingEl.style.display = 'none';
      loadingEl.setAttribute('aria-busy', 'false');
    }
  }, 120);
};

const apiCall = async (endpoint, options = {}, config = {}, retryCount = 0) => {
  const shouldShowLoader = config.showLoader !== false;
  if (shouldShowLoader) showLoading();

  try {
    const { headers: optHeaders, ...restOptions } = options;
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...optHeaders
      }
    });

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

    if (res.status === 204) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      return text ? { message: text } : null;
    }

    return res.json();
  } catch (err) {
    console.error(err);
    if (!config.silent) {
      alert(err.message);
    }
    return null;
  } finally {
    if (shouldShowLoader) hideLoading();
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
const calcDiscountedPrice = (price, discount) => {
  if (!discount || discount <= 0) return price;
  return Math.round(price - (price * discount / 100));
};
const formatPrice = (price) => {
  return price.toLocaleString('en-IN');
};

const renderProducts = (products, container) => {
  container.innerHTML = products.map(p => {
    const hasDiscount = p.discount > 0;
    const finalPrice = calcDiscountedPrice(p.price, p.discount);
    const isOutOfStock = p.stock !== undefined && p.stock <= 0;

    // Use category as brand, default to 'HADI FASHION'
    const brandName = (p.category || 'HADI FASHION').toUpperCase();

    return `
    <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" onclick="HADI.goToProduct('${p.id ?? p._id}')">
      <div class="product-image">
        ${p.images && p.images.length > 0 
          ? `<img src="${p.images[0]}" alt="${p.name}">`
          : `<div class="placeholder-img">${brandName.charAt(0)}</div>`}
        <div class="heart-icon-wrapper" onclick="event.stopPropagation(); this.classList.toggle('active')">
          <i class="ri-heart-line"></i>
          <i class="ri-heart-fill"></i>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${brandName}</div>
        <div class="product-name-row">
          <div class="product-name" title="${p.name}">${p.name}</div>
          <div class="assured-badge"><img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured"></div>
        </div>
        <div class="price-container">
          <div class="product-price">₹${formatPrice(finalPrice)}</div>
          ${hasDiscount ? `<div class="product-price-original">₹${formatPrice(p.price)}</div>` : ''}
          ${hasDiscount ? `<div class="product-discount">${p.discount}% off</div>` : ''}
        </div>
        ${hasDiscount ? `<div class="hot-deal-badge">Hot Deal</div>` : ''}
      </div>
    </div>`;
  }).join('');
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
  renderProducts,
  calcDiscountedPrice,
  formatPrice
};
