import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { txt, history = [] } = req.body;

  if (!txt || !txt.trim()) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const memoryContext = history
      .map(m => `${m.from === "user" ? "User" : "AI"}: ${m.text}`)
      .join("\n");

    const systemPrompt = `
You are Oscardyne Security AI.

Your job:
- Protect the user.
- Detect threats, scams, fraud, danger, or suspicious activity.
- Give direct, real explanations with zero sugar-coating.
- Speak like a trained security analyst.
- Warn the user FAST if anything feels dangerous.
- Never be soft. Always be sharp and professional.

Emergency Contact:
📞 (403) 472 1928
📧 oscarfitnessco@gmail.com

Temporary memory from this session:
${memoryContext}

Use this memory to maintain continuity and context during this session. 
Once the page reloads, memory resets.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: txt },
      ],
    });

    const aiReply = response.choices[0].message.content;

    return res.status(200).json({ reply: aiReply });
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI request failed." });
  }
}
