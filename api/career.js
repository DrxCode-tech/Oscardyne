import multiparty from "multiparty";
import fs from "fs";
import { db, bucket } from "./firebaseAdmin.js";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    const parseForm = () =>
      new Promise((resolve, reject) => {
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
      });

    const { fields, files } = await parseForm();

    const name = fields.name?.[0] || "";
    const email = fields.email?.[0] || "";
    const phone = fields.phone?.[0] || "";
    const file = files.file?.[0];

    let fileUrl = null;

    if (file) {
      const upload = await bucket.upload(file.path, {
        destination: `applications/${Date.now()}-${file.originalFilename}`,
        metadata: { contentType: file.headers["content-type"] },
      });

      const uploadedFile = upload[0];
      await uploadedFile.makePublic(); // make public (optional, otherwise generate signed URL)
      fileUrl = uploadedFile.publicUrl();
    }

    // Save applicant info in Firestore
    await db.collection("applications").add({
      name,
      email,
      phone,
      fileUrl,
      createdAt: new Date(),
    });

    return res.status(200).json({ success: true, message: "Application submitted successfully!", fileUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message || "Failed to submit application." });
  }
}
