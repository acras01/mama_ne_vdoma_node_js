import admin from 'firebase-admin';
import firebaseKey from './firebase-key.json';

export const FirebaseFactory = async () => {
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: firebaseKey.client_email,
      privateKey: firebaseKey.private_key,
      projectId: firebaseKey.project_id,
    }),
  });
  return app;
};
