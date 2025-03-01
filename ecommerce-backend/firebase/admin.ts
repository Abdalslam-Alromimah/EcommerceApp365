import * as admin from 'firebase-admin';
import path from 'path';

// Use a resolved path to ensure the file is found correctly
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export default admin;