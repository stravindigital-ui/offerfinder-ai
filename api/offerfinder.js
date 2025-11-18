// Force Node.js runtime so environment variables WORK
export const config = {
  runtime: "nodejs"
};

import OpenAI from "openai";

export async function POST(req) {
  try {
    // Parse incoming JSON
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Missing `message` in request body" }),
        { status: 400 }
      );
    }

    // Debug log (shows in Vercel logs)
    console.log("ENV CHECK:", {
      keyExists: !!process.env.OPENAI_API_KEY,
      agentExists: !!process.env.OFFERFINDER_AGENT_ID
    });

    // Create OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Call your OfferFinder AI agent workflow
    const response = await client.responses.create({
      model: "gpt-4.1",
      agent_id: process.env.OFFERFINDER_AGENT_ID,
      input: message
    });

    // Response format differs across models — normalize output
    const output =
      response.output_text ||
      response.response_text ||
      JSON.stringify(response, null, 2);

    return new Response(
      JSON.stringify({ reply: output }),
      { status: 200 }
    );

  } catch (err) {
    console.error("OfferFinder API Error:", err);

    return new Response(
      JSON.stringify({
        error: err.message || "Unknown server error",
        stack: err.stack || ""
      }),
      { status: 500 }
    );
  }
}
