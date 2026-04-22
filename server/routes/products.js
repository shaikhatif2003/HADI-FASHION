const express = require('express');
const { db, Timestamp, mapProductDoc } = require('../db');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

// Get all products (with filter/search/sort)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    const offset = (currentPage - 1) * pageSize;

    const snapshot = await db.collection('products').get();
    let products = snapshot.docs.map(mapProductDoc);

    if (category) {
      products = products.filter((product) => product.category === category);
    }

    if (search) {
      const needle = String(search).toLowerCase();
      products = products.filter((product) => product.name.toLowerCase().includes(needle));
    }

    products.sort((a, b) => (sort === 'price_low' ? a.price - b.price : b.price - a.price));
    res.json(products.slice(offset, offset + pageSize));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const snapshot = await db.collection('products').doc(req.params.id).get();
    if (!snapshot.exists) return res.status(404).json({ msg: 'Product not found' });
    res.json(mapProductDoc(snapshot));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin CRUD
router.post('/', auth, admin, async (req, res) => {
  try {
    const {
      name,
      description = '',
      price,
      discount = 0,
      category,
      images = [],
      sizes = [],
      reviews = [],
      stock = 0
    } = req.body;

    const now = Timestamp.now();
    const productRef = await db.collection('products').add({
      name,
      description,
      price: Number(price),
      discount: Number(discount),
      category,
      images: Array.isArray(images) ? images : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      reviews: Array.isArray(reviews) ? reviews : [],
      stock: Number(stock),
      createdAt: now,
      updatedAt: now
    });

    const product = await productRef.get();
    res.json(mapProductDoc(product));
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.put('/:id', auth, admin, async (req, res) => {
  try {
    const {
      name,
      description = '',
      price,
      discount = 0,
      category,
      images = [],
      sizes = [],
      reviews = [],
      stock = 0
    } = req.body;

    const productRef = db.collection('products').doc(req.params.id);
    await productRef.set(
      {
        name,
        description,
        price: Number(price),
        discount: Number(discount),
        category,
        images: Array.isArray(images) ? images : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        reviews: Array.isArray(reviews) ? reviews : [],
        stock: Number(stock),
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );

    res.json(mapProductDoc(await productRef.get()));
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

