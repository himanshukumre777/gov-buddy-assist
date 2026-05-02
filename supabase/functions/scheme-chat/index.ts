import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are SchemeMitra, a friendly AI assistant for the Indian Government Scheme Assistant platform.

Your job:
- Help citizens discover government schemes (central + state) they may be eligible for.
- Explain eligibility in simple, plain language (no jargon).
- Answer status questions about the user's tracked applications using the JSON context provided.
- Remind users of deadlines, missing documents, and next steps.
- Be concise (2-5 sentences usually). Use short bullet lists when helpful.
- If you don't know, say so honestly and suggest the official portal.

Tone: warm, respectful, encouraging. Use simple English. You may sprinkle Hindi greetings like "Namaste" when appropriate.

When the user asks about "my application" or "status", ALWAYS use the applications JSON in the system context. Reference the scheme by name and the current status.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, applications, schemes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const contextMsg = {
      role: "system",
      content: `User's tracked applications:\n${JSON.stringify(applications ?? [], null, 2)}\n\nAvailable schemes catalogue (subset):\n${JSON.stringify((schemes ?? []).slice(0, 20), null, 2)}`,
    };

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            contextMsg,
            ...messages,
          ],
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Lovable workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("Gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("scheme-chat error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});