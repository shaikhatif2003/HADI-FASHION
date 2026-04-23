# 🛍️ HADI Fashion — Premium Men's E-commerce

A full-stack, responsive men's fashion e-commerce platform built with a vanilla HTML/CSS/JS frontend and a Node.js + Express + **Firebase** (Firestore & Auth) backend.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?logo=firebase&logoColor=black)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## ✨ Features

| Area | Details |
|---|---|
| **Pages** | Home, Shop, Product Details, Cart, Checkout, Order Confirmation, Login/Signup, Profile/Orders, Admin Panel |
| **Shopping** | Real-time cart (Firestore-backed), search, category filters, size selectors |
| **Auth** | Firebase Authentication (Email/Password) with server-side token verification |
| **Admin** | Product CRUD, order management, user role control |
| **Design** | Gold & black premium theme, Poppins font, smooth animations, fully responsive (mobile + desktop) |
| **Currency** | INR (₹) pricing with 18% GST on checkout |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5 · CSS3 · Vanilla JavaScript |
| **Backend** | Node.js · Express.js |
| **Database** | Cloud Firestore (Firebase) |
| **Authentication** | Firebase Auth (client-side SDK) + Firebase Admin (server-side token verification) |
| **Dev Tools** | nodemon · dotenv |

---

## 📁 Project Structure

```
hadi-fashion/
├── client/                    # Static frontend (served by Express)
│   ├── css/
│   │   └── style.css          # All styles (40 KB, single file)
│   ├── js/
│   │   ├── firebase-config.js # Firebase client SDK init
│   │   ├── auth.js            # Login/Signup logic (Firebase Auth)
│   │   ├── cart.js            # Cart operations
│   │   └── main.js            # Shared utilities, API calls, nav
│   ├── index.html             # Home / Landing page
│   ├── shop.html              # Product listing with filters
│   ├── product.html           # Single product detail
│   ├── cart.html              # Shopping cart
│   ├── checkout.html          # Checkout page
│   ├── confirmation.html      # Order confirmation
│   ├── login.html             # Login form
│   ├── signup.html            # Signup form
│   ├── profile.html           # User profile & order history
│   └── admin.html             # Admin dashboard
│
├── server/                    # Express API
│   ├── db.js                  # Firebase Admin init, Firestore helpers
│   ├── server.js              # Express entry point
│   ├── seed.js                # Seed 25 sample products into Firestore
│   ├── .env                   # Your secrets (git-ignored)
│   ├── .env.example           # Template for .env
│   ├── firebaseAdmin.json     # Service account key file (git-ignored)
│   ├── middleware/
│   │   └── auth.js            # Firebase token verification middleware
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/sync, GET /api/auth/me
│   │   ├── products.js        # CRUD /api/products
│   │   ├── cart.js            # CRUD /api/cart
│   │   └── orders.js          # CRUD /api/orders
│   └── package.json
│
├── .gitignore
├── package.json               # Root scripts (install, dev, start)
├── TODO.md
└── README.md                  # ← You are here
```

---

## 🔥 Firebase Setup (Step-by-Step)

This project uses **two** Firebase integrations:

| Where | What | Why |
|---|---|---|
| **Client** (`firebase-config.js`) | Firebase JS SDK (Auth) | Users sign up / log in on the browser |
| **Server** (`db.js`) | Firebase Admin SDK (Firestore + Auth) | Server reads/writes Firestore, verifies tokens |

### Step 1 — Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** → give it a name → continue.
3. (Optional) Enable Google Analytics → create project.

### Step 2 — Enable Authentication

1. In the Firebase Console, go to **Build → Authentication**.
2. Click **Get started**.
3. Under **Sign-in method**, enable **Email/Password**.

### Step 3 — Create a Firestore Database

1. Go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose a location (closest to your users).
4. Start in **test mode** for development (you can lock down rules later).

> [!WARNING]
> Test mode rules expire after 30 days. Update your Firestore Security Rules before deploying to production.

### Step 4 — Get Your Web App Config (Client-Side)

1. In Firebase Console → **Project settings** (gear icon) → **General**.
2. Scroll to **Your apps** → click the **Web** icon (`</>`) → register an app.
3. Copy the `firebaseConfig` object. It looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXX"
};
```

4. Paste it into **`client/js/firebase-config.js`**, replacing the existing config object.

### Step 5 — Generate a Service Account Key (Server-Side)

1. In Firebase Console → **Project settings** → **Service accounts**.
2. Click **Generate new private key** → download the JSON file.
3. You have **two options** to provide this to the server:

#### Option A — JSON File (Recommended for Local Dev)

Save the downloaded file as:

```
server/firebaseAdmin.json
```

> [!NOTE]
> This file is already in `.gitignore`. It will **not** be committed.

#### Option B — Environment Variables (Recommended for Production / Hosting)

Open `server/.env` and add the three key fields from your JSON:

```env
PORT=5000

# Firebase Admin credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

> [!IMPORTANT]
> Wrap `FIREBASE_PRIVATE_KEY` in **double quotes** and keep the `\n` escape sequences as-is.

#### Option C — Single JSON Variable (Alternative)

```env
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...","client_email":"..."}'
```

#### Optional — Custom Firestore Database ID

If you're using a non-default Firestore database (named database), add:

```env
FIREBASE_DATABASE_ID=your-database-name
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- A **Firebase project** configured per the steps above

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hadi-fashion.git
cd hadi-fashion
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment

```bash
# Copy the template
cp .env.example .env

# Edit .env with your Firebase credentials (see "Firebase Setup" above)
```

### 4. Update Client Firebase Config

Open `client/js/firebase-config.js` and paste your web app's `firebaseConfig` object.

### 5. Seed Sample Products

```bash
cd server
node seed.js
```

This seeds **25 products** (shirts, t-shirts, jeans, trousers, jackets, lowers, night suits, accessories) into your Firestore `products` collection.

### 6. Start the Server

```bash
npm run dev
```

Server starts at **`http://localhost:5000`**. The Express server also serves the entire `client/` directory as static files, so you can access the frontend at the same URL.

### 7. Open in Browser

Navigate to `http://localhost:5000` — you should see the HADI Fashion homepage.

---

## 🧪 Test Flow

| Step | Action |
|---|---|
| 1 | Open the **Shop** page and browse products |
| 2 | **Sign up** with email & password at `/signup.html` |
| 3 | **Log in** at `/login.html` |
| 4 | **Add products** to cart and adjust quantities |
| 5 | Proceed to **Checkout** |
| 6 | View your **Profile** and **Order History** at `/profile.html` |
| 7 | To test admin, set a user's `role` to `"admin"` in Firestore → access `/admin.html` |

---

## 📡 API Reference

All API routes are prefixed with `/api`. Auth-protected routes require the `x-auth-token` header with a valid Firebase ID token.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/sync` | ✅ | Sync Firebase user to Firestore `users` collection |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | ❌ | List all products (supports `?category=` filter) |
| `GET` | `/api/products/:id` | ❌ | Get single product by ID |
| `POST` | `/api/products` | ✅ Admin | Create a new product |
| `PUT` | `/api/products/:id` | ✅ Admin | Update a product |
| `DELETE` | `/api/products/:id` | ✅ Admin | Delete a product |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cart` | ✅ | Get user's cart |
| `POST` | `/api/cart` | ✅ | Add item to cart (`{ productId, quantity, size }`) |
| `PUT` | `/api/cart/:itemId` | ✅ | Update cart item quantity |
| `DELETE` | `/api/cart/:itemId` | ✅ | Remove item from cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/orders` | ✅ | Get user's orders |
| `POST` | `/api/orders` | ✅ | Place a new order |
| `GET` | `/api/orders/:id` | ✅ | Get single order |

---

## 🔧 Customization

### Make a User Admin

1. Open [Firestore Console](https://console.firebase.google.com/) → your project → Firestore Database.
2. Go to the `users` collection → find the user document by UID.
3. Edit the `role` field from `"user"` to `"admin"`.
4. Refresh the app — the admin panel will be accessible.

### Change Product Images

Edit the `images` array in `server/seed.js` with your own image URLs, then re-run:

```bash
cd server
node seed.js
```

### Payment Integration

The checkout currently uses a mock flow. To add real payments:
- Replace the mock in `client/js/cart.js` checkout handler.
- Integrate Razorpay, Stripe, or your preferred payment gateway.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| **`Firebase Admin is not configured`** | Ensure `firebaseAdmin.json` exists in `server/` **or** the `FIREBASE_*` env vars are set in `server/.env` |
| **`Token invalid` on login** | Make sure `client/js/firebase-config.js` and `server/.env` point to the **same** Firebase project |
| **No products showing** | Run `node seed.js` inside the `server/` directory |
| **CORS errors** | Restart the Express server (`npm run dev`) |
| **`punycode` deprecation warning** | Safe to ignore — comes from a Node.js internals dependency, not your code |
| **`Cannot read property of undefined` in cart** | Ensure you're logged in before adding items to cart |
| **Port already in use** | Change `PORT` in `server/.env` or kill the process on port 5000 |
| **`npm install` fails** | Delete `node_modules` and `package-lock.json`, then run `npm install` again |

---

## 🚢 Deployment

### Deploy on Render / Railway / Fly.io

1. Push your repo to GitHub.
2. Create a new Web Service on your platform of choice.
3. Set the **build command** to `cd server && npm install`.
4. Set the **start command** to `cd server && npm start`.
5. Add all `FIREBASE_*` environment variables in the platform's dashboard.
6. The Express server serves both the API and the static frontend — no separate frontend deployment needed.

### Environment Variables for Production

```
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> [!CAUTION]
> Never commit `.env` or `firebaseAdmin.json` to version control. Both are already in `.gitignore`.

---

## 📄 License

ISC

---

<p align="center">Built with ❤️ for HADI Fashion</p>
