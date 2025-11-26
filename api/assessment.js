import { db } from "./firebaseAdmin"; // your admin SDK initializer
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = req.body;

    // 1. AI generates personalised report
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a senior security consultant.  
Be very personalised.  
Use the client’s exact details.  
Give real-world context.  
No generic answers.  
Focus on real threats, weaknesses and actionable steps.`
        },
        {
          role: "user",
          content: JSON.stringify(form)
        }
      ]
    });

    const aiReport = ai.choices[0].message.content;

    // 2. Save to Firestore
    await db.collection("assessments").add({
      ...form,
      aiReport,
      createdAt: new Date().toISOString(),
    });

    // 3. Respond to frontend
    return res.status(200).json({
      message: "Assessment generated",
      aiReport,
    });

  } catch (error) {
    console.error("ASSESSMENT ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
