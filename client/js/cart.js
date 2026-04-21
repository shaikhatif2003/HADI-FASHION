// Cart specific functionality

const loadCart = async () => {
  const user = HADI.getUser();
  let cart;

  const loadingEl = document.getElementById('cart-loading');
  const emptyEl = document.getElementById('cart-empty');
  const contentEl = document.getElementById('cart-content');

  // Show loading
  if (loadingEl) loadingEl.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'none';

  if (user && HADI.getToken()) {
    cart = await HADI.apiCall('/cart', {
      headers: { 'x-auth-token': HADI.getToken() }
    }, { silent: true });
  }

  if (!cart) {
    cart = { items: JSON.parse(localStorage.getItem('cart') || '[]') };
  }

  // Hide loading
  if (loadingEl) loadingEl.style.display = 'none';

  // Empty state
  if (!cart.items || cart.items.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';
    return;
  }

  // Show cart content
  if (emptyEl) emptyEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'grid';

  // Update item count badge
  const totalItems = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const countBadge = document.getElementById('cart-item-count');
  if (countBadge) countBadge.textContent = totalItems;

  // Render cart items
  const container = document.getElementById('cart-items');
  container.innerHTML = cart.items.map((item, index) => {
    const product = item.productId || {};
    const name = product.name || 'Product';
    const price = product.price || 0;
    const image = product.images && product.images.length > 0 ? product.images[0] : null;
    const itemId = item.id ?? item._id;
    const lineTotal = (price * item.quantity) || 0;

    return `
    <div class="cart-item-card" style="animation-delay: ${index * 0.1}s">
      <div class="cart-item-image-wrapper">
        ${image
          ? `<img src="${image}" alt="${name}" class="cart-item-img">`
          : `<div class="cart-item-placeholder">${name.charAt(0)}</div>`
        }
      </div>
      <div class="cart-item-details">
        <div class="cart-item-top-row">
          <div>
            <h3 class="cart-item-name">${name}</h3>
            <div class="cart-item-meta">
              ${item.size ? `<span class="cart-item-size">Size: ${item.size}</span>` : ''}
              <span class="cart-item-unit-price">$${price.toFixed(2)} each</span>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeItem('${itemId}')" title="Remove item">
            <i class="ri-close-line"></i>
          </button>
        </div>
        <div class="cart-item-bottom-row">
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty('${itemId}', ${item.quantity}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
              <i class="ri-subtract-line"></i>
            </button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${itemId}', ${item.quantity}, 1)">
              <i class="ri-add-line"></i>
            </button>
          </div>
          <div class="cart-item-line-total">$${lineTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + ((item.productId?.price || 0) * (item.quantity || 0)), 0);
  const tax = subtotal * 0.08; // 8% estimated tax
  const total = subtotal + tax;

  document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax-price').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
};

window.updateQty = async (itemId, currentQty, delta) => {
  const newQty = currentQty + delta;
  if (newQty < 1) return;

  const user = HADI.getUser();
  if (user && HADI.getToken()) {
    await HADI.apiCall(`/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'x-auth-token': HADI.getToken()
      },
      body: JSON.stringify({ quantity: newQty })
    });
  } else {
    // Local cart update
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = localCart.find(i => (i.id ?? i._id) === itemId);
    if (item) {
      item.quantity = newQty;
      localStorage.setItem('cart', JSON.stringify(localCart));
    }
  }
  await loadCart();
  HADI.updateCartCount();
};

window.removeItem = async (itemId) => {
  const user = HADI.getUser();
  if (user && HADI.getToken()) {
    await HADI.apiCall(`/cart/${itemId}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': HADI.getToken() }
    });
  } else {
    // Local cart remove
    let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localCart = localCart.filter(i => (i.id ?? i._id) !== itemId);
    localStorage.setItem('cart', JSON.stringify(localCart));
  }
  await loadCart();
  HADI.updateCartCount();
};

window.clearCart = async () => {
  if (!confirm('Are you sure you want to clear your entire cart?')) return;

  const user = HADI.getUser();
  if (user && HADI.getToken()) {
    // Get all cart items and delete them
    const cart = await HADI.apiCall('/cart', {
      headers: { 'x-auth-token': HADI.getToken() }
    }, { silent: true });

    if (cart?.items) {
      await Promise.all(cart.items.map(item =>
        HADI.apiCall(`/cart/${item.id ?? item._id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': HADI.getToken() }
        })
      ));
    }
  } else {
    localStorage.setItem('cart', '[]');
  }
  await loadCart();
  HADI.updateCartCount();
};

window.applyPromo = () => {
  const code = document.getElementById('promo-code').value.trim();
  if (!code) return;
  // Mock promo code - can be connected to backend later
  alert('Promo codes coming soon!');
};
