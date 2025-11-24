import nodemailer from "nodemailer";
import multiparty from "multiparty";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // disable default body parser
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Wrap multiparty in a promise so we can await it
    const parseForm = () =>
      new Promise((resolve, reject) => {
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    const { fields, files } = await parseForm();

    const name = fields.name?.[0] || "";
    const email = fields.email?.[0] || "";
    const phone = fields.phone?.[0] || "";
    const file = files.file?.[0];

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "marydanielima@gmail.com",
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
  } catch (error) {
    console.error("Career API Error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to send application." });
  }
}
