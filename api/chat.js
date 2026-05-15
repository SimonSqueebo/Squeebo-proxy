import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-squeebo-secret");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const body = req.body || {};
    console.log("BODY RECEIVED:", JSON.stringify(body));

    const model = body.model || "claude-haiku-4-5";
    const max_tokens = body.max_tokens || 1000;
    const system = body.system || undefined;

    let messages;

    if (body.messages) {
      messages = body.messages;
    } else if (body.message) {
      messages = [{ role: "user", content: body.message }];
    } else {
      return res.status(400).json({ error: "Missing message" });
    }

    const response = await anthropic.messages.create({
      model,
      max_tokens,
      system,
      messages,
    });

   return res.status(200).json({
  content: response.content
});
  } catch (error) {
    console.error("Claude error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}