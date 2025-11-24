import nodemailer from "nodemailer";
import multiparty from "multiparty"; // for parsing multipart/form-data
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // disable default body parser
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const name = fields.name?.[0] || "";
      const email = fields.email?.[0] || "";
      const phone = fields.phone?.[0] || "";
      const file = files.file?.[0];

      // Setup Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Gmail App Password
        },
      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // HR email
        subject: `New Career Application: ${name}`,
        html: `
          <h2>New Applicant Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        `,
        attachments: file
          ? [
              {
                filename: file.originalFilename,
                content: fs.readFileSync(file.path),
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ success: true, message: "Application submitted successfully!" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to send application." });
  }
}
