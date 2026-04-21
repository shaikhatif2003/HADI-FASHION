require('dotenv').config();
const { db, Timestamp, initDb } = require('./db');

const products = [
  // Shirts
  {
    name: 'Premium Cotton Shirt',
    description: 'Comfort fit white cotton shirt',
    price: 49.99,
    discount: 20,
    category: 'shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/xsoabyPiqoZEZNYx.webp'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50
  },
  {
    name: 'Casual Linen Shirt',
    description: 'Beige breathable linen shirt',
    price: 55.00,
    discount: 0,
    category: 'shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DAZIIMlMTaxeoyiY.jpeg'],
    sizes: ['M', 'L', 'XL'],
    stock: 35
  },
  {
    name: 'Denim Work Shirt',
    description: 'Rugged blue denim shirt',
    price: 45.00,
    discount: 10,
    category: 'shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/lUVVXJZjAIFFAiHQ.webp'],
    sizes: ['S', 'M', 'L'],
    stock: 20
  },
  {
    name: 'Men Solid Casual White Shirt',
    description: 'Pure cotton, full sleeve, spread collar white shirt.',
    price: 1599,
    discount: 78,
    category: 'shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/idENyVjjCRjXeZCu.webp'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 70
  },

  // T-Shirts
  {
    name: 'Classic Graphic Tee',
    description: 'Vintage rock band graphic tee',
    price: 29.99,
    discount: 0,
    category: 't-shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/TFFAkQtyXXWueDNQ.jpeg'],
    sizes: ['S', 'M', 'L'],
    stock: 100
  },
  {
    name: 'Oversized Plain Tee',
    description: 'Heavyweight black oversized tee',
    price: 24.99,
    discount: 5,
    category: 't-shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/PtTYDVrIikUmgCot.jpeg'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 120
  },
  {
    name: 'Striped Polo Shirt',
    description: 'Navy and white striped polo',
    price: 34.00,
    discount: 15,
    category: 't-shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/aVBgpSYEwcpQxJTW.jpeg'],
    sizes: ['M', 'L'],
    stock: 45
  },
  {
    name: 'Men Solid Round Neck Black T-Shirt',
    description: 'Pure cotton, round neck black t-shirt.',
    price: 799,
    discount: 60,
    category: 't-shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/tNlMcCWjxSDNBxBr.webp'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 150
  },

  // Jeans & Trousers
  {
    name: 'Slim Fit Dark Jeans',
    description: 'Deep indigo slim fit denim',
    price: 69.99,
    discount: 10,
    category: 'jeans',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DwKaQESARsPOAmiG.jpeg'],
    sizes: ['30', '32', '34'],
    stock: 30
  },
  {
    name: 'Relaxed Fit Light Wash',
    description: '90s style light wash jeans',
    price: 65.00,
    discount: 0,
    category: 'jeans',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/WAGhoODOmCBThPZy.webp'],
    sizes: ['32', '34', '36'],
    stock: 25
  },
  {
    name: 'Formal Chino Trousers',
    description: 'Khaki slim fit chinos',
    price: 59.99,
    discount: 0,
    category: 'trousers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/N2V9RJ0pJMO6.jpeg'],
    sizes: ['30', '32', '34', '36'],
    stock: 40
  },
  {
    name: 'Black Dress Pants',
    description: 'Perfect for formal occasions',
    price: 79.99,
    discount: 20,
    category: 'trousers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DwKaQESARsPOAmiG.jpeg'],
    sizes: ['30', '32', '34'],
    stock: 15
  },
  {
    name: 'Men Slim Mid Rise Dark Blue Jeans',
    description: 'KILLER brand, slim fit, mid rise dark blue jeans.',
    price: 3699,
    discount: 65,
    category: 'jeans',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DwKaQESARsPOAmiG.jpeg'],
    sizes: ['30', '32', '34', '36'],
    stock: 28
  },

  // Outerwear
  {
    name: 'Leather Biker Jacket',
    description: 'Genuine black leather jacket',
    price: 199.99,
    discount: 10,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/koHQLBlgiUGAlqaW.jpg'],
    sizes: ['M', 'L', 'XL'],
    stock: 10
  },
  {
    name: 'Denim Trucker Jacket',
    description: 'Classic blue denim outerwear',
    price: 89.00,
    discount: 0,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/WfuihjCsiRYNMCrO.jpeg'],
    sizes: ['S', 'M', 'L'],
    stock: 22
  },
  {
    name: 'Hooded Windbreaker',
    description: 'Waterproof olive windbreaker',
    price: 59.00,
    discount: 15,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/NrIoRornApxxBgbd.jpeg'],
    sizes: ['M', 'L'],
    stock: 18
  },
  {
    name: 'Classic Grey Hoodie',
    description: 'Soft fleece-lined hoodie',
    price: 45.00,
    discount: 0,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/RJIIPdDZQpHvDMks.webp'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 60
  },

  // Lowers & Comfort
  {
    name: 'City Cargo Pants',
    description: 'Modern multi-pocket cargos',
    price: 59.99,
    discount: 0,
    category: 'lowers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/tVMaSOSknlHeTcMK.jpeg'],
    sizes: ['30', '32', '34'],
    stock: 35
  },
  {
    name: 'Fleece Joggers',
    description: 'Comfortable grey sweatpants',
    price: 35.00,
    discount: 0,
    category: 'lowers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/tVMaSOSknlHeTcMK.jpeg'],
    sizes: ['S', 'M', 'L'],
    stock: 50
  },
  {
    name: 'Checkered Night Suit',
    description: 'Flannel sleepwear set',
    price: 39.99,
    discount: 25,
    category: 'night suits',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/ntnmFtVhhrBgzByR.jpeg'],
    sizes: ['M', 'L', 'XL'],
    stock: 40
  },
  {
    name: 'Silk Loungewear',
    description: 'Premium navy silk set',
    price: 85.00,
    discount: 0,
    category: 'night suits',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DydktxJISidBJRJX.webp'],
    sizes: ['S', 'M'],
    stock: 12
  },

  // Footwear & Accessories
  {
    name: 'Urban Sneakers',
    description: 'Minimalist white leather sneakers',
    price: 89.99,
    discount: 10,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/GVniDUdqpFgIrVwg.jpeg'],
    sizes: ['8', '9', '10', '11'],
    stock: 20
  },
  {
    name: 'Classic Leather Belt',
    description: 'Brown genuine leather belt',
    price: 25.00,
    discount: 0,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/jVTTvTurJXnIdKyh.jpeg'],
    sizes: ['32', '34', '36'],
    stock: 100
  },
  {
    name: 'Minimalist Wallet',
    description: 'Black slim leather cardholder',
    price: 19.99,
    discount: 0,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/EwVQdBRVijqdGqXx.jpeg'],
    sizes: ['One Size'],
    stock: 80
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Gold frame dark lens aviators',
    price: 45.00,
    discount: 20,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/zIMzRFkrNUtDKtGF.jpeg'],
    sizes: ['One Size'],
    stock: 35
  }
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

