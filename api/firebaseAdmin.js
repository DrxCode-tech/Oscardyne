import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "note-44501.appspot.com", // your bucket
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
