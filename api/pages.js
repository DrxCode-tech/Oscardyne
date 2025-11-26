import { db } from "./firebaseAdmin";

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("careerApplications")
      .orderBy("submittedAt", "desc")
      .get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ applications });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to fetch applications." });
  }
}
