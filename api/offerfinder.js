import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Missing `message` in request body" }),
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1",
      agent: process.env.OFFERFINDER_AGENT_ID,  // Agent ID here
      input: message,
    });

    return new Response(JSON.stringify(response.output_text), {
      status: 200,
    });

  } catch (err) {
    console.error("OfferFinder API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
