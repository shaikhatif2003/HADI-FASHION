const express = require('express');
const { auth } = require('../middleware/auth');
const { db, Timestamp, mapProductDoc } = require('../db');
const router = express.Router();

const getProductMap = async (productIds) => {
  const uniqueIds = [...new Set(productIds.filter(Boolean))];
  const entries = await Promise.all(
    uniqueIds.map(async (productId) => {
      const snapshot = await db.collection('products').doc(productId).get();
      return [productId, snapshot.exists ? mapProductDoc(snapshot) : null];
    })
  );

  return new Map(entries);
};

const getCart = async (userId) => {
  const cartSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('cartItems')
    .orderBy('createdAt', 'desc')
    .get();

  const productMap = await getProductMap(cartSnapshot.docs.map((doc) => doc.data().productId));

  return {
    items: cartSnapshot.docs.map((doc) => {
      const row = doc.data();
      return {
        id: doc.id,
        _id: doc.id,
        quantity: Number(row.quantity || 0),
        size: row.size || null,
        createdAt: row.createdAt?.toDate?.()?.toISOString?.() || null,
        updatedAt: row.updatedAt?.toDate?.()?.toISOString?.() || null,
        productId: productMap.get(row.productId)
      };
    })
  };
};

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    res.json(await getCart(req.userId));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const cartCollection = db.collection('users').doc(req.userId).collection('cartItems');
    const existingSnapshot = await cartCollection
      .where('productId', '==', productId)
      .where('size', '==', size || null)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];
      await existingDoc.ref.set(
        {
          quantity: Number(existingDoc.data().quantity || 0) + Number(quantity),
          updatedAt: Timestamp.now()
        },
        { merge: true }
      );
    } else {
      const now = Timestamp.now();
      await cartCollection.add({
        productId,
        quantity: Number(quantity),
        size: size || null,
        createdAt: now,
        updatedAt: now
      });
    }

    res.json(await getCart(req.userId));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update cart item
router.put('/:itemId', auth, async (req, res) => {
  try {
    await db
      .collection('users')
      .doc(req.userId)
      .collection('cartItems')
      .doc(req.params.itemId)
      .set(
        {
          quantity: Number(req.body.quantity),
          updatedAt: Timestamp.now()
        },
        { merge: true }
      );

    res.json(await getCart(req.userId));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Remove item
router.delete('/:itemId', auth, async (req, res) => {
  try {
    await db.collection('users').doc(req.userId).collection('cartItems').doc(req.params.itemId).delete();
    res.json(await getCart(req.userId));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

