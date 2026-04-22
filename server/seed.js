require('dotenv').config();
const { db, Timestamp, initDb } = require('./db');

const products = [
  { name: 'Premium Cotton Shirt', description: 'Comfort fit cotton shirt', price: 49.99, discount: 20, category: 'shirts', images: [], sizes: ['S', 'M', 'L', 'XL'], stock: 50 },
  { name: 'Slim Fit Jeans', description: 'Stretch denim jeans', price: 69.99, discount: 10, category: 'jeans', images: [], sizes: ['30', '32', '34'], stock: 30 },
  { name: 'Graphic T-Shirt', description: 'Soft cotton graphic tee', price: 29.99, discount: 0, category: 't-shirts', images: [], sizes: ['S', 'M', 'L'], stock: 100 },
  { name: 'Formal Trousers', description: 'Slim fit wool blend', price: 89.99, discount: 15, category: 'trousers', images: [], sizes: ['30', '32', '34', '36'], stock: 25 },
  { name: 'Cargo Lowers', description: 'Multi-pocket cargo pants', price: 59.99, discount: 0, category: 'lowers', images: [], sizes: ['30', '32'], stock: 40 },
  { name: 'Night Suit Set', description: 'Comfortable sleepwear set', price: 39.99, discount: 25, category: 'night suits', images: [], sizes: ['S', 'M', 'L'], stock: 60 }
];

const seed = async () => {
  try {
    await initDb();
    console.log('Seeding Firebase products collection...');

    const snapshot = await db.collection('products').get();
    const deleteBatch = db.batch();
    snapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
    if (!snapshot.empty) {
      await deleteBatch.commit();
    }

    for (const product of products) {
      await db.collection('products').add({
        ...product,
        reviews: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }

    console.log('Seeded', products.length, 'products');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();

