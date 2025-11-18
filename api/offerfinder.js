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

    // 🔥 NEW API — WORKFLOWS
    const run = await client.workflows.runs.create({
      workflow_id: process.env.OFFERFINDER_WORKFLOW_ID, // <--- FIXED
      input: { user_message: message }
    });

    return new Response(
      JSON.stringify({ output_text: run.output_text }),
      { status: 200 }
    );

  } catch (err) {
    console.error("OfferFinder API Error:", err);

    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { status: 500 }
    );
  }
}
