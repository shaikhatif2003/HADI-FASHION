const express = require('express');
const { auth, syncUserFromFirebase } = require('../db');
const { auth: requireAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/sync', requireAuth, async (req, res) => {
  try {
    const firebaseRecord = await auth.getUser(req.firebaseUser.uid);
    const user = await syncUserFromFirebase(firebaseRecord, { name: req.body.name });
    res.json({ token: req.token, user });
  } catch (err) {
    res.status(err.status || 500).json({ msg: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(err.status || 500).json({ msg: err.message });
  }
});

module.exports = router;

