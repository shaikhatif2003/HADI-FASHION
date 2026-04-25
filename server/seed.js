require('dotenv').config();
const { db, Timestamp, initDb } = require('./db');

const products = [
  // Shirts
  {
    name: 'Premium Cotton Shirt',
    description: 'Comfort fit white cotton shirt',
    price: 3999,
    discount: 20,
    category: 'shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/xsoabyPiqoZEZNYx.webp'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50
  },
  {
    name: 'Casual Linen Shirt',
    description: 'Beige breathable linen shirt',
    price: 4499,
    discount: 0,
    category: 'shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DAZIIMlMTaxeoyiY.jpeg'],
    sizes: ['M', 'L', 'XL'],
    stock: 35
  },
  {
    name: 'Denim Work Shirt',
    description: 'Rugged blue denim shirt',
    price: 3699,
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
    price: 2499,
    discount: 0,
    category: 't-shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/TFFAkQtyXXWueDNQ.jpeg'],
    sizes: ['S', 'M', 'L'],
    stock: 100
  },
  {
    name: 'Oversized Plain Tee',
    description: 'Heavyweight black oversized tee',
    price: 1999,
    discount: 5,
    category: 't-shirts',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/PtTYDVrIikUmgCot.jpeg'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 120
  },
  {
    name: 'Striped Polo Shirt',
    description: 'Navy and white striped polo',
    price: 2799,
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
    price: 5799,
    discount: 10,
    category: 'jeans',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/DwKaQESARsPOAmiG.jpeg'],
    sizes: ['30', '32', '34'],
    stock: 30
  },
  {
    name: 'Relaxed Fit Light Wash',
    description: '90s style light wash jeans',
    price: 5299,
    discount: 0,
    category: 'jeans',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/WAGhoODOmCBThPZy.webp'],
    sizes: ['32', '34', '36'],
    stock: 25
  },
  {
    name: 'Formal Chino Trousers',
    description: 'Khaki slim fit chinos',
    price: 4999,
    discount: 0,
    category: 'trousers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/N2V9RJ0pJMO6.jpeg'],
    sizes: ['30', '32', '34', '36'],
    stock: 40
  },
  {
    name: 'Black Dress Pants',
    description: 'Perfect for formal occasions',
    price: 6599,
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
    price: 16999,
    discount: 10,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/koHQLBlgiUGAlqaW.jpg'],
    sizes: ['M', 'L', 'XL'],
    stock: 10
  },
  {
    name: 'Denim Trucker Jacket',
    description: 'Classic blue denim outerwear',
    price: 7499,
    discount: 0,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/WfuihjCsiRYNMCrO.jpeg'],
    sizes: ['S', 'M', 'L'],
    stock: 22
  },
  {
    name: 'Hooded Windbreaker',
    description: 'Waterproof olive windbreaker',
    price: 4999,
    discount: 15,
    category: 'jackets',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/NrIoRornApxxBgbd.jpeg'],
    sizes: ['M', 'L'],
    stock: 18
  },
  {
    name: 'Classic Grey Hoodie',
    description: 'Soft fleece-lined hoodie',
    price: 3799,
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
    price: 4999,
    discount: 0,
    category: 'lowers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/tVMaSOSknlHeTcMK.jpeg'],
    sizes: ['30', '32', '34'],
    stock: 35
  },
  {
    name: 'Fleece Joggers',
    description: 'Comfortable grey sweatpants',
    price: 2899,
    discount: 0,
    category: 'lowers',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/tVMaSOSknlHeTcMK.jpeg'],
    sizes: ['S', 'M', 'L'],
    stock: 50
  },
  {
    name: 'Checkered Night Suit',
    description: 'Flannel sleepwear set',
    price: 3299,
    discount: 25,
    category: 'night suits',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/ntnmFtVhhrBgzByR.jpeg'],
    sizes: ['M', 'L', 'XL'],
    stock: 40
  },
  {
    name: 'Silk Loungewear',
    description: 'Premium navy silk set',
    price: 6999,
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
    price: 7499,
    discount: 10,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/GVniDUdqpFgIrVwg.jpeg'],
    sizes: ['8', '9', '10', '11'],
    stock: 20
  },
  {
    name: 'Classic Leather Belt',
    description: 'Brown genuine leather belt',
    price: 1999,
    discount: 0,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/jVTTvTurJXnIdKyh.jpeg'],
    sizes: ['32', '34', '36'],
    stock: 100
  },
  {
    name: 'Minimalist Wallet',
    description: 'Black slim leather cardholder',
    price: 1599,
    discount: 0,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/EwVQdBRVijqdGqXx.jpeg'],
    sizes: ['One Size'],
    stock: 80
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Gold frame dark lens aviators',
    price: 3799,
    discount: 20,
    category: 'accessories',
    images: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663537365120/zIMzRFkrNUtDKtGF.jpeg'],
    sizes: ['One Size'],
    stock: 35
  },

  // New Season Shirts
  {
    name: 'Oxford Button Down Shirt',
    description: 'Structured sky blue Oxford shirt with a clean button-down collar.',
    price: 2799,
    discount: 18,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 64
  },
  {
    name: 'Black Satin Evening Shirt',
    description: 'Smooth satin finish shirt designed for parties and dinner events.',
    price: 3299,
    discount: 12,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    stock: 38
  },
  {
    name: 'Checked Flannel Overshirt',
    description: 'Warm brushed cotton overshirt for layering in cooler weather.',
    price: 3499,
    discount: 22,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 46
  },

  // New T-Shirts
  {
    name: 'Premium Pique Polo',
    description: 'Textured cotton polo with ribbed collar and tailored sleeve fit.',
    price: 1899,
    discount: 15,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 90
  },
  {
    name: 'Washed Brown Crew Neck Tee',
    description: 'Garment-dyed crew neck t-shirt with a soft vintage hand feel.',
    price: 1299,
    discount: 10,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 110
  },
  {
    name: 'Performance Training Tee',
    description: 'Quick-dry stretch t-shirt made for workouts and daily comfort.',
    price: 1499,
    discount: 20,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 85
  },

  // New Jeans & Trousers
  {
    name: 'Straight Fit Raw Denim',
    description: 'Clean raw indigo denim with a straight modern silhouette.',
    price: 4299,
    discount: 25,
    category: 'jeans',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 52
  },
  {
    name: 'Tapered Black Jeans',
    description: 'Black stretch denim with a tapered fit for everyday styling.',
    price: 3999,
    discount: 18,
    category: 'jeans',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 44
  },
  {
    name: 'Pleated Tailored Trousers',
    description: 'Premium pleated trousers with a relaxed tailored drape.',
    price: 4599,
    discount: 14,
    category: 'trousers',
    images: ['https://images.unsplash.com/photo-1506629905607-d9c297d48fda?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 36
  },
  {
    name: 'Stretch Travel Chinos',
    description: 'Wrinkle-resistant chinos with stretch comfort for long days.',
    price: 3799,
    discount: 16,
    category: 'trousers',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 58
  },

  // New Jackets
  {
    name: 'Suede Bomber Jacket',
    description: 'Soft tan suede-look bomber with ribbed cuffs and premium finish.',
    price: 8999,
    discount: 20,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24
  },
  {
    name: 'Quilted Utility Jacket',
    description: 'Lightweight quilted jacket with warm lining and snap closure.',
    price: 6799,
    discount: 15,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    stock: 32
  },
  {
    name: 'Varsity Zip Jacket',
    description: 'Sport-inspired varsity jacket with contrast sleeves and trim.',
    price: 5499,
    discount: 12,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L'],
    stock: 29
  },

  // New Lowers & Nightwear
  {
    name: 'Relaxed Utility Cargos',
    description: 'Relaxed fit cargos with reinforced pockets and adjustable hems.',
    price: 3899,
    discount: 18,
    category: 'lowers',
    images: ['https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 56
  },
  {
    name: 'Premium Lounge Joggers',
    description: 'Soft knit joggers with a tapered leg and clean minimal styling.',
    price: 2499,
    discount: 10,
    category: 'lowers',
    images: ['https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 75
  },
  {
    name: 'Cotton Pajama Set',
    description: 'Breathable cotton sleepwear set with a relaxed shirt and pajama.',
    price: 2999,
    discount: 20,
    category: 'night suits',
    images: ['https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 42
  },
  {
    name: 'Ribbed Lounge Set',
    description: 'Premium ribbed co-ord loungewear for home and travel comfort.',
    price: 4299,
    discount: 12,
    category: 'night suits',
    images: ['https://images.unsplash.com/photo-1618354691551-44de113f0164?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    stock: 28
  },

  // New Accessories
  {
    name: 'Leather Chelsea Boots',
    description: 'Polished black Chelsea boots with elastic side panels.',
    price: 6999,
    discount: 15,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['7', '8', '9', '10', '11'],
    stock: 26
  },
  {
    name: 'Canvas Weekender Bag',
    description: 'Durable canvas travel bag with leather trims and roomy storage.',
    price: 4999,
    discount: 18,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['One Size'],
    stock: 34
  },
  {
    name: 'Minimal Steel Watch',
    description: 'Clean stainless steel watch with a black dial and mesh strap.',
    price: 6499,
    discount: 22,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['One Size'],
    stock: 31
  },
  {
    name: 'Textured Knit Beanie',
    description: 'Soft ribbed knit beanie for winter layering and casual outfits.',
    price: 999,
    discount: 10,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['One Size'],
    stock: 68
  },

  // Fresh Clothing Drop
  {
    name: 'Mandarin Collar Linen Shirt',
    description: 'Lightweight linen blend shirt with a refined mandarin collar.',
    price: 2299,
    discount: 18,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 72
  },
  {
    name: 'Printed Resort Shirt',
    description: 'Relaxed short sleeve shirt with an easy vacation-ready print.',
    price: 1999,
    discount: 12,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 60
  },
  {
    name: 'Slim Fit Charcoal Shirt',
    description: 'Smart charcoal shirt with a slim profile for office and evening wear.',
    price: 2499,
    discount: 15,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1603252109612-24fa03d145c8?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    stock: 43
  },
  {
    name: 'Embroidered Casual Shirt',
    description: 'Soft cotton shirt with subtle embroidery and a premium finish.',
    price: 2899,
    discount: 20,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L'],
    stock: 39
  },
  {
    name: 'Heavyweight White Tee',
    description: 'Premium heavyweight cotton t-shirt with a clean structured drape.',
    price: 1199,
    discount: 10,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 140
  },
  {
    name: 'Color Block Rugby Tee',
    description: 'Long sleeve rugby-inspired tee with bold color block panels.',
    price: 1799,
    discount: 14,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 78
  },
  {
    name: 'Textured Henley T-Shirt',
    description: 'Soft textured henley with a three-button placket and easy fit.',
    price: 1599,
    discount: 16,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1618354691438-25bc04584c23?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 88
  },
  {
    name: 'Relaxed Vintage Wash Tee',
    description: 'Sun-faded cotton tee with a relaxed body and worn-in softness.',
    price: 1399,
    discount: 8,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L'],
    stock: 95
  },
  {
    name: 'Stone Washed Slim Jeans',
    description: 'Stone washed denim with stretch comfort and a sharp slim fit.',
    price: 3899,
    discount: 18,
    category: 'jeans',
    images: ['https://images.unsplash.com/photo-1511196044526-5cb3bcb7071b?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 54
  },
  {
    name: 'Baggy Carpenter Jeans',
    description: 'Utility-inspired carpenter jeans with a relaxed streetwear shape.',
    price: 4499,
    discount: 15,
    category: 'jeans',
    images: ['https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 41
  },
  {
    name: 'Cream Straight Jeans',
    description: 'Clean cream denim with a straight leg and versatile neutral tone.',
    price: 4199,
    discount: 12,
    category: 'jeans',
    images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 37
  },
  {
    name: 'Navy Formal Trousers',
    description: 'Flat front navy trousers with a polished slim tapered cut.',
    price: 3499,
    discount: 20,
    category: 'trousers',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 62
  },
  {
    name: 'Olive Drawstring Trousers',
    description: 'Smart casual trousers with a hidden drawstring waist and stretch fabric.',
    price: 3299,
    discount: 14,
    category: 'trousers',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 49
  },
  {
    name: 'Wide Leg Linen Trousers',
    description: 'Breathable linen trousers with a relaxed wide leg summer fit.',
    price: 3799,
    discount: 16,
    category: 'trousers',
    images: ['https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    stock: 45
  },
  {
    name: 'Cropped Tech Jacket',
    description: 'Modern lightweight jacket with zip pockets and a cropped profile.',
    price: 5999,
    discount: 18,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35
  },
  {
    name: 'Corduroy Overshirt Jacket',
    description: 'Soft corduroy layer with shirt styling and jacket-level warmth.',
    price: 5299,
    discount: 15,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 33
  },
  {
    name: 'Puffer Vest Jacket',
    description: 'Sleeveless padded vest for layering over tees, shirts, and hoodies.',
    price: 4799,
    discount: 12,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    stock: 30
  },
  {
    name: 'Tapered Cargo Joggers',
    description: 'Hybrid cargo joggers with utility pockets and a tapered ankle.',
    price: 2799,
    discount: 18,
    category: 'lowers',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 83
  },
  {
    name: 'Cotton Lounge Shorts',
    description: 'Soft cotton shorts with an elastic waist for warm weather comfort.',
    price: 1499,
    discount: 10,
    category: 'lowers',
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 96
  },
  {
    name: 'Satin Stripe Night Suit',
    description: 'Smooth satin night suit with contrast piping and a relaxed fit.',
    price: 3499,
    discount: 18,
    category: 'night suits',
    images: ['https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40
  },
  {
    name: 'Thermal Winter Night Suit',
    description: 'Warm thermal sleepwear set built for cold nights and indoor lounging.',
    price: 3299,
    discount: 20,
    category: 'night suits',
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    stock: 36
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

