require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, auth: firebaseAuth } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Test root - fallback to index.html for SPA-like behavior or just serve the home
app.get('/api', (req, res) => res.send('HADI Fashion API running'));

initDb()
  .then(() => {
    console.log('Firebase connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Firebase error:', err.message);
    process.exit(1);
  });

