require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('🔥 Firebase initialized');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  process.exit(1);
}

const db = admin.firestore();

const client = jwksClient({
  jwksUri: 'https://esignet.ida.fayda.et/.well-known/jwks.json',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error('❌ JWKS key fetch failed:', err);
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, getKey, {
    algorithms: [process.env.ALGORITHM],
    audience: process.env.CLIENT_ID,
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    }
    req.user = decoded;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('BloodLink backend is running');
});

app.get('/api/createTestUser', async (req, res) => {
  try {
    const testUserId = 'test-user-1';
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      bloodType: 'O+',
    };
    console.log('📥 Writing test user to Firestore...');
    await db.collection('users').doc(testUserId).set(userData);
    console.log('✅ Test user created in Firestore');
    res.json({ message: 'Test user created', userId: testUserId });
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    res.status(500).json({ message: 'Error creating test user', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BloodLink backend running on port ${PORT}`);
});
app.get('/api/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});
app.post('/api/users', async (req, res) => {
  try {
    const { id, name, email, bloodType } = req.body;
    if (!id || !name || !email || !bloodType) {
      return res.status(400).json({ message: 'Missing required user fields' });
    }

    await db.collection('users').doc(id).set({ name, email, bloodType });
    res.json({ message: 'User created', userId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});
