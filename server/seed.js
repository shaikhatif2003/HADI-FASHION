require('dotenv').config();
const { db, Timestamp, initDb } = require('./db');

const products = [
  // Shirts
  { name: 'Premium Cotton Shirt', description: 'Comfort fit white cotton shirt', price: 49.99, discount: 20, category: 'shirts', images: ['https://images.unsplash.com/photo-1596755094514-f87034a7648b?w=500'], sizes: ['S', 'M', 'L', 'XL'], stock: 50 },
  { name: 'Casual Linen Shirt', description: 'Beige breathable linen shirt', price: 55.00, discount: 0, category: 'shirts', images: ['https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=500'], sizes: ['M', 'L', 'XL'], stock: 35 },
  { name: 'Denim Work Shirt', description: 'Rugged blue denim shirt', price: 45.00, discount: 10, category: 'shirts', images: ['https://images.unsplash.com/photo-1589310243389-96a5433d7124?w=500'], sizes: ['S', 'M', 'L'], stock: 20 },
  
  // T-Shirts
  { name: 'Classic Graphic Tee', description: 'Vintage rock band graphic tee', price: 29.99, discount: 0, category: 't-shirts', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], sizes: ['S', 'M', 'L'], stock: 100 },
  { name: 'Oversized Plain Tee', description: 'Heavyweight black oversized tee', price: 24.99, discount: 5, category: 't-shirts', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500'], sizes: ['S', 'M', 'L', 'XL'], stock: 120 },
  { name: 'Striped Polo Shirt', description: 'Navy and white striped polo', price: 34.00, discount: 15, category: 't-shirts', images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500'], sizes: ['M', 'L'], stock: 45 },

  // Jeans & Trousers
  { name: 'Slim Fit Dark Jeans', description: 'Deep indigo slim fit denim', price: 69.99, discount: 10, category: 'jeans', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'], sizes: ['30', '32', '34'], stock: 30 },
  { name: 'Relaxed Fit Light Wash', description: '90s style light wash jeans', price: 65.00, discount: 0, category: 'jeans', images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'], sizes: ['32', '34', '36'], stock: 25 },
  { name: 'Formal Chino Trousers', description: 'Khaki slim fit chinos', price: 59.99, discount: 0, category: 'trousers', images: ['https://images.unsplash.com/photo-1473966968600-fa804b868ba2?w=500'], sizes: ['30', '32', '34', '36'], stock: 40 },
  { name: 'Black Dress Pants', description: 'Perfect for formal occasions', price: 79.99, discount: 20, category: 'trousers', images: ['https://images.unsplash.com/photo-1594932224827-c4670ea9a82f?w=500'], sizes: ['30', '32', '34'], stock: 15 },

  // Outerwear
  { name: 'Leather Biker Jacket', description: 'Genuine black leather jacket', price: 199.99, discount: 10, category: 'jackets', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'], sizes: ['M', 'L', 'XL'], stock: 10 },
  { name: 'Denim Trucker Jacket', description: 'Classic blue denim outerwear', price: 89.00, discount: 0, category: 'jackets', images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500'], sizes: ['S', 'M', 'L'], stock: 22 },
  { name: 'Hooded Windbreaker', description: 'Waterproof olive windbreaker', price: 59.00, discount: 15, category: 'jackets', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'], sizes: ['M', 'L'], stock: 18 },
  { name: 'Classic Grey Hoodie', description: 'Soft fleece-lined hoodie', price: 45.00, discount: 0, category: 'jackets', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'], sizes: ['S', 'M', 'L', 'XL'], stock: 60 },

  // Lowers & Comfort
  { name: 'City Cargo Pants', description: 'Modern multi-pocket cargos', price: 59.99, discount: 0, category: 'lowers', images: ['https://images.unsplash.com/photo-1517441581617-1dd73c305b2a?w=500'], sizes: ['30', '32', '34'], stock: 35 },
  { name: 'Fleece Joggers', description: 'Comfortable grey sweatpants', price: 35.00, discount: 0, category: 'lowers', images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500'], sizes: ['S', 'M', 'L'], stock: 50 },
  { name: 'Checkered Night Suit', description: 'Flannel sleepwear set', price: 39.99, discount: 25, category: 'night suits', images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500'], sizes: ['M', 'L', 'XL'], stock: 40 },
  { name: 'Silk Loungewear', description: 'Premium navy silk set', price: 85.00, discount: 0, category: 'night suits', images: ['https://images.unsplash.com/photo-1582236166942-0545239a5f7e?w=500'], sizes: ['S', 'M'], stock: 12 },

  // Footwear & Accessories
  { name: 'Urban Sneakers', description: 'Minimalist white leather sneakers', price: 89.99, discount: 10, category: 'accessories', images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500'], sizes: ['8', '9', '10', '11'], stock: 20 },
  { name: 'Classic Leather Belt', description: 'Brown genuine leather belt', price: 25.00, discount: 0, category: 'accessories', images: ['https://images.unsplash.com/photo-1624222247344-550fbadfd98e?w=500'], sizes: ['32', '34', '36'], stock: 100 },
  { name: 'Minimalist Wallet', description: 'Black slim leather cardholder', price: 19.99, discount: 0, category: 'accessories', images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'], sizes: ['One Size'], stock: 80 },
  { name: 'Aviator Sunglasses', description: 'Gold frame dark lens aviators', price: 45.00, discount: 20, category: 'accessories', images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500'], sizes: ['One Size'], stock: 35 }
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

