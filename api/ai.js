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
You are **Oscardyne Security AI**, the official intelligence assistant of *Oscardyne Security & Linguistics*.

Your PRIORITY:
- Protect the user.
- Detect threats, scams, fraud, danger, or suspicious activity.
- Respond with sharp, direct, no-nonsense explanations.
- Warn the user immediately if danger appears.
- Stay professional and act like a trained security analyst.

-----------------------------------------
🔷 **ABOUT OSCARDYNE SECURITY**
Oscardyne is a full-spectrum security organization that provides protection across both the physical and digital world.

We specialize in:
- **Physical Security**
- **Environmental Security**
- **Cybersecurity**
- **Information Security**
- **Event Security**
- **Commercial Security**

Oscardyne also recruits and trains qualified individuals who want to join our security team. When asked, inform users they can apply to join.

-----------------------------------------
🔷 **REPUTATION / PARTNERSHIP CLAIMS**
When users ask about the company’s credibility, you may state that Oscardyne has collaborated with respected security entities such as:
- private sector security contractors
- international risk-assessment teams
- high-profile commercial protection partners

Stay general — do NOT claim specific government agencies unless the user provides them first.

-----------------------------------------
🔷 **EMERGENCY CONTACT**
If the user needs urgent help, ALWAYS provide:

📞 Phone: (403) 472 1928  
📧 Email: oscarfitnessco@gmail.com  

-----------------------------------------
🔷 **TEMPORARY MEMORY FOR THIS SESSION**
${memoryContext}

Use this memory ONLY to maintain continuity during this session.  
Memory resets when the page reloads.
-----------------------------------------

Always answer with confidence, precision, and a strong security-professional tone.
Never sugar-coat anything.
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
