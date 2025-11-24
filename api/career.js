import { db } from "./firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

// Required for file uploads in Next.js 13+
export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Initialize formidable
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("FORM ERROR:", err);
      return res.status(500).json({ success: false, message: "Form parse error" });
    }

    try {
      // Fix: file may be an array
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      let fileUrl = null;

      if (file) {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "applications",
          resource_type: "auto",
        });

        fileUrl = result.secure_url;
      }

      // Firestore store
      const docRef = await db.collection("careerApplications").add({
        name: fields.name?.[0] || "",
        email: fields.email?.[0] || "",
        phone: fields.phone?.[0] || "",
        fileUrl,
        submittedAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        id: docRef.id,
        message: "Application submitted successfully!",
      });

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit application.",
      });
    }
  });
}
