import { db } from "./firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

// Required for file uploads in Next.js 13+
export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Ensure tmp folder exists (required on Vercel)
  const uploadDir = "/tmp/uploads";
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("FORM ERROR:", err);
      return res.status(500).json({ success: false, message: "Form parse error" });
    }

    console.log("FILES:", files); // debug
    console.log("FIELDS:", fields);

    try {
      const file = files.file;
      let fileUrl = null;

      if (file) {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "applications",
          resource_type: "auto",
        });

        fileUrl = result.secure_url;
      }

      const docRef = await db.collection("careerApplications").add({
        name: fields.name || "",
        email: fields.email || "",
        phone: fields.phone || "",
        fileUrl,
        submittedAt: new Date(),
      });

      return res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      return res.status(500).json({ success: false, message: "Failed to submit application." });
    }
  });
}
