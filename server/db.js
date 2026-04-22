const admin = require('firebase-admin');

const getServiceAccount = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      return parsed;
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
    }
  }

  throw new Error(
    'Firebase Admin is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to server/.env.'
  );
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount())
  });
}

const db = admin.firestore();
const auth = admin.auth();
const { FieldValue, Timestamp } = admin.firestore;

const toDateString = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const mapProductDoc = (doc) => {
  const row = typeof doc.data === 'function' ? doc.data() : doc;
  const id = typeof doc.id === 'string' ? doc.id : row.id;

  return {
    id,
    _id: id,
    name: row.name || '',
    description: row.description || '',
    price: Number(row.price || 0),
    discount: Number(row.discount || 0),
    category: row.category || '',
    images: ensureArray(row.images),
    sizes: ensureArray(row.sizes),
    reviews: ensureArray(row.reviews),
    stock: Number(row.stock || 0),
    createdAt: toDateString(row.createdAt),
    updatedAt: toDateString(row.updatedAt)
  };
};

const mapUserDoc = (doc) => {
  const row = typeof doc.data === 'function' ? doc.data() : doc;
  const id = typeof doc.id === 'string' ? doc.id : row.id;

  return {
    id,
    email: row.email || '',
    name: row.name || null,
    role: row.role || 'user',
    firebaseUid: id,
    createdAt: toDateString(row.createdAt),
    updatedAt: toDateString(row.updatedAt)
  };
};

const syncUserFromFirebase = async (firebaseUser, extra = {}) => {
  const userRef = db.collection('users').doc(firebaseUser.uid);
  const snapshot = await userRef.get();
  const current = snapshot.exists ? snapshot.data() : {};
  const now = Timestamp.now();

  const payload = {
    email: firebaseUser.email || current.email || extra.email || '',
    name:
      extra.name ||
      firebaseUser.name ||
      firebaseUser.displayName ||
      current.name ||
      firebaseUser.email?.split('@')[0] ||
      null,
    role: current.role || extra.role || 'user',
    updatedAt: now
  };

  if (!snapshot.exists) {
    payload.createdAt = now;
  }

  await userRef.set(payload, { merge: true });
  return mapUserDoc(await userRef.get());
};

const initDb = async () => {
  return true;
};

module.exports = {
  admin,
  auth,
  db,
  FieldValue,
  Timestamp,
  initDb,
  mapProductDoc,
  mapUserDoc,
  syncUserFromFirebase
};
