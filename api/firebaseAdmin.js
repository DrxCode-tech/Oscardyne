import admin from "firebase-admin";

const serviceKey = process.env.FIREBASE_ADMIN_KEY;
console.log("KEY EXISTS?", process.env.FIREBASE_ADMIN_KEY ? "YES" : "NO");


if (!serviceKey) {
  throw new Error("FIREBASE_ADMIN_KEY is missing");
}

const parsedKey = JSON.parse(serviceKey);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(parsedKey)
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
