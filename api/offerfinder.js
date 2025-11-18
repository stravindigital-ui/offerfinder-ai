import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const providedKey = body.privateKey; // sent from client

    // 1. Validate access key BEFORE doing anything else
    if (!providedKey || providedKey !== process.env.PRIVATE_ACCESS_KEY) {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
    }

    // 2. Validate message
    if (!message) {
      return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3. OpenAI response
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "user", content: message }
      ],
    });

    const output = completion.choices[0].message.content;

    return new Response(JSON.stringify({ output }), { status: 200 });

  } catch (err) {
    console.error("OfferFinder Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
