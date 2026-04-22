const express = require('express');
const { auth } = require('../middleware/auth');
const { db, Timestamp, mapProductDoc } = require('../db');
const router = express.Router();

const getOrders = async (userId) => {
  const orderSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('orders')
    .orderBy('createdAt', 'desc')
    .get();

  return orderSnapshot.docs.map((doc) => {
    const order = doc.data();
    return {
      id: doc.id,
      _id: doc.id,
      total: Number(order.total || 0),
      status: order.status || 'pending',
      paymentMethod: order.paymentMethod || null,
      address: order.address || {
        street: null,
        city: null,
        zip: null,
        country: null
      },
      createdAt: order.createdAt?.toDate?.()?.toISOString?.() || null,
      updatedAt: order.updatedAt?.toDate?.()?.toISOString?.() || null,
      items: Array.isArray(order.items)
        ? order.items.map((item, index) => ({
            id: item.id || `${doc.id}-${index}`,
            _id: item.id || `${doc.id}-${index}`,
            quantity: Number(item.quantity || 0),
            size: item.size || null,
            price: Number(item.price || 0),
            productId: mapProductDoc(item.product || {})
          }))
        : []
    };
  });
};

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    res.json(await getOrders(req.userId));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create order from cart
router.post('/', auth, async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;
    const cartCollection = db.collection('users').doc(req.userId).collection('cartItems');
    const cartSnapshot = await cartCollection.get();

    if (cartSnapshot.empty) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    const items = await Promise.all(
      cartSnapshot.docs.map(async (cartDoc) => {
        const cartItem = cartDoc.data();
        const productSnapshot = await db.collection('products').doc(cartItem.productId).get();
        if (!productSnapshot.exists) {
          throw new Error(`Product ${cartItem.productId} no longer exists.`);
        }

        const product = mapProductDoc(productSnapshot);
        return {
          id: cartDoc.id,
          quantity: Number(cartItem.quantity || 0),
          size: cartItem.size || null,
          price: product.price,
          product
        };
      })
    );

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const now = Timestamp.now();
    const orderRef = db.collection('users').doc(req.userId).collection('orders').doc();
    const batch = db.batch();

    batch.set(orderRef, {
      total,
      status: 'pending',
      paymentMethod: paymentMethod || null,
      address: {
        street: address?.street || null,
        city: address?.city || null,
        zip: address?.zip || null,
        country: address?.country || null
      },
      items,
      createdAt: now,
      updatedAt: now
    });

    cartSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    const orders = await getOrders(req.userId);
    const newOrder = orders.find((order) => order.id === orderRef.id);
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

