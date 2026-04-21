// Cart specific functionality

const loadCart = async () => {
  const user = HADI.getUser();
  let cart;
  
  if (user && HADI.getToken()) {
    cart = await HADI.apiCall('/cart', {
      headers: { 'x-auth-token': HADI.getToken() }
    });
  } else {
    cart = { items: JSON.parse(localStorage.getItem('cart') || '[]') };
  }
  
  const container = document.getElementById('cart-items');
  container.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        ${item.productId?.images && item.productId.images.length > 0
          ? `<img src="${item.productId.images[0]}" alt="${item.productId.name}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">`
          : (item.productId?.name?.[0] || 'P')}
      </div>
      <div style="flex:1;">
        <h3>${item.productId?.name || 'Product'}</h3>
        <p>Size: ${item.size || 'N/A'} | $${item.productId?.price || 0}</p>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn" onclick="updateQty('${item.id ?? item._id}', -1)">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="updateQty('${item.id ?? item._id}', 1)">+</button>
      </div>
      <div>$${ (item.productId?.price * item.quantity || 0).toFixed(2) }</div>
      <button class="btn" onclick="removeItem('${item.id ?? item._id}')">Remove</button>
    </div>
  `).join('') || '<p>Your cart is empty</p>';
  
  const total = cart.items.reduce((sum, item) => sum + (item.productId?.price * item.quantity || 0), 0);
  document.getElementById('total-price').textContent = total.toFixed(2);
};

window.updateQty = async (itemId, delta) => {
  const user = HADI.getUser();
  if (user) {
    await HADI.apiCall(`/cart/${itemId}`, {
      method: 'PUT',
      headers: { 
        'x-auth-token': HADI.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: parseInt(event.target.parentElement.querySelector('span').textContent) + delta })
    });
  } // Local cart update logic...
  loadCart();
  HADI.updateCartCount();
};

window.removeItem = async (itemId) => {
  const user = HADI.getUser();
  if (user) {
    await HADI.apiCall(`/cart/${itemId}`, { method: 'DELETE', headers: { 'x-auth-token': HADI.getToken() } });
  }
  loadCart();
  HADI.updateCartCount();
};

