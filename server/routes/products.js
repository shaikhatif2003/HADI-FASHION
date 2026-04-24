const express = require('express');
const { db, Timestamp, mapProductDoc } = require('../db');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

const CATEGORIES = [
  'shirts',
  'jeans',
  't-shirts',
  'trousers',
  'jackets',
  'lowers',
  'night suits',
  'accessories'
];

const getAdminKey = () => process.env.ADMIN_KEY || 'hadi-admin';

const liteAdmin = (req, res, next) => {
  const key = req.header('x-admin-key') || req.body?.adminKey;
  if (!key || key !== getAdminKey()) {
    return res.status(403).json({ msg: 'Invalid admin key' });
  }
  next();
};

const toArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeProductInput = (body) => {
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();
  const category = String(body.category || '').trim().toLowerCase();
  const price = Number(body.price);
  const discount = Number(body.discount || 0);
  const stock = Number(body.stock || 0);
  const images = toArray(body.images || body.imageUrl);
  const sizes = toArray(body.sizes);

  if (!name) throw new Error('Product name is required');
  if (!Number.isFinite(price) || price <= 0) throw new Error('Valid product price is required');
  if (!CATEGORIES.includes(category)) throw new Error('Valid category is required');
  if (!Number.isFinite(discount) || discount < 0 || discount > 99) throw new Error('Discount must be between 0 and 99');
  if (!Number.isFinite(stock) || stock < 0) throw new Error('Stock must be 0 or greater');

  return {
    name,
    description,
    price,
    discount,
    category,
    images,
    sizes,
    reviews: Array.isArray(body.reviews) ? body.reviews : [],
    stock
  };
};

const createProduct = async (payload) => {
  const now = Timestamp.now();
  const productRef = await db.collection('products').add({
    ...payload,
    createdAt: now,
    updatedAt: now
  });
  return mapProductDoc(await productRef.get());
};

// Lightweight admin endpoints protected by ADMIN_KEY.
router.get('/admin-lite/all', liteAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    res.json(snapshot.docs.map(mapProductDoc));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/admin-lite', liteAdmin, async (req, res) => {
  try {
    res.json(await createProduct(normalizeProductInput(req.body)));
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.delete('/admin-lite/:id', liteAdmin, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all products (with filter/search/sort)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page, limit } = req.query;
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 200;
    const offset = (currentPage - 1) * pageSize;

    const snapshot = await db.collection('products').get();
    let products = snapshot.docs.map(mapProductDoc);

    if (category) {
      products = products.filter((product) => product.category === category);
    }

    if (search) {
      const needle = String(search).toLowerCase();
      products = products.filter((product) =>
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle)
      );
    }

    if (sort === 'price_low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === '-price') {
      products.sort((a, b) => b.price - a.price);
    }
    // else: no sort param => keep default Firestore order

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
    res.json(await createProduct(normalizeProductInput(req.body)));
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

