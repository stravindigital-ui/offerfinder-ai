export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  try {
    const body = await request.json();

    const { message } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Missing 'message' in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: message,
        agent_id: "asst_bLKR93tzFbW6qVP3xDENnrcU"
      }),
    });

    const data = await openaiRes.json();

    return new Response(JSON.stringify(data), {
      status: openaiRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

