const { auth: firebaseAuth, db, mapUserDoc } = require('../db');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Verifying token...');
    const decoded = await firebaseAuth.verifyIdToken(token);
    console.log('Token verified for user:', decoded.uid);
    
    const userSnapshot = await db.collection('users').doc(decoded.uid).get();
    const user = userSnapshot.exists
      ? mapUserDoc(userSnapshot)
      : {
          id: decoded.uid,
          email: decoded.email || '',
          name: decoded.name || decoded.email?.split('@')[0] || null,
          role: 'user',
          firebaseUid: decoded.uid
        };

    req.token = token;
    req.firebaseUser = decoded;
    req.user = user;
    req.userId = user.id;
    next();
  } catch (e) {
    console.error('Auth verification error:', {
      message: e.message,
      code: e.code,
      hasToken: !!token,
      tokenLength: token?.length
    });
    res.status(401).json({ msg: 'Token invalid', error: e.message });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

module.exports = { auth, admin };

