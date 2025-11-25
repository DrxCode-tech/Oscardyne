export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const emailBody = `
New Contact Request from Oscardyne Website

Name: ${name}
Phone: ${phone}
Email: ${email}

Message:
${message}
    `;

    const send = await fetch("https://api.tawilo.com/v1/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAWILO_API_KEY}`,
      },
      body: JSON.stringify({
        to: "anietiedaniel11@gmail.com",
        subject: "New Oscardyne Security Contact Request",
        text: emailBody,
      }),
    });

    const data = await send.json();

    if (!send.ok) {
      return res.status(500).json({ error: "Failed to send email", details: data });
    }

    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
