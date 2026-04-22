# HADI Fashion - Premium Men's E-commerce

Fully dynamic, responsive e-commerce website built with modern HTML/CSS/JS frontend and Node.js/Express/MySQL backend.

## ✨ Features
- ✅ Home, Shop, Product details, Cart, Checkout, Auth (login/signup), Profile/Orders, Admin panel
- ✅ Real-time cart, search, filters, wishlist (local), reviews (mock)
- ✅ Responsive design (mobile/desktop), animations, gold/black theme
- ✅ Professional UI like Myntra/Ajio
- ✅ Secure auth (JWT), order management

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Auth**: Supabase Auth + app JWT

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MySQL (local or hosted - update `.env`)

### 2. Backend Setup
```bash
cd server
npm install
# Update server/.env with your MySQL and Supabase keys
npm run dev
```
Server runs on `http://localhost:5000`

Add these values to `server/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hadifashion
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. Seed Sample Data (run once)
```bash
cd server
node seed.js
```

### 4. Frontend
Open `client/index.html` in browser (works with Live Server or directly)

### 5. Test Flow
1. Browse shop/index.html
2. Signup/login at login.html with your Supabase-backed account
3. Add products to cart
4. Checkout
5. View profile/orders
6. Admin panel (login as admin user)

## 📁 Structure
```
f:/HADI FASHION/
├── client/      # Static frontend
├── server/      # Node/Express API + MongoDB
└── README.md
```

## 🔧 Customization
- **DB**: Update `server/.env` MySQL settings
- **Images**: Add to `client/assets/` 
- **Payment**: Replace mock in checkout.js
- **Admin**: Create admin user via signup + manually set role: 'admin' in DB

## 🐛 Troubleshooting
- Backend not connecting? Check MySQL running + your `DB_*` values
- CORS issues? Restart server
- No products? Run seed.js
- npm issues? Delete node_modules + npm install

## 🎨 Design Credits
Modern, responsive theme with Poppins font, gold/black color scheme, smooth animations.

**Live Demo Ready!** Open `client/index.html`

---
Built by BLACKBOXAI
