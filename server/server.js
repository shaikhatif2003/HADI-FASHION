require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb, auth: firebaseAuth } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Test root
app.get('/', (req, res) => res.send('HADI Fashion API running - visit /api/products'));

// Debug endpoint
app.get('/api/debug/firebase', (req, res) => {
  try {
    const projectId = firebaseAuth.app?.options?.projectId;
    res.json({ 
      firebaseConnected: !!firebaseAuth,
      projectId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initDb()
  .then(() => {
    console.log('Firebase connected');
    console.log('Firebase project ID:', firebaseAuth.app?.options?.projectId);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Firebase error:', err.message);
    process.exit(1);
  });

