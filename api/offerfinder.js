import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1",
      agent: process.env.OFFERFINDER_AGENT_ID,
      input: message,
    });

    return res.status(200).json({ reply: response.output_text });

  } catch (err) {
    console.error("OfferFinder API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
