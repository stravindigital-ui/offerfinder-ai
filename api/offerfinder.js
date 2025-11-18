import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // FIXED — new OpenAI syntax
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
