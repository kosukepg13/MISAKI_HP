import admin from 'firebase-admin';
import path from 'path';

// Firestore 初期化
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || path.join(__dirname, '../serviceAccountKey.json');

if (!admin.apps.length) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
  } catch (err) {
    console.error('Failed to initialize Firebase', err);
    throw err;
  }
}

export const firestore = admin.firestore();
