import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.22.1";

const openaiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

const openai = new OpenAI({
  apiKey: openaiKey,
});

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!openaiKey) {
    return new Response("OpenAI API key not configured", { status: 500 });
  }

  try {
    const { image_base64 } = await req.json();
    
    if (!image_base64) {
      return new Response("Missing image_base64", { status: 400 });
    }

    const systemPrompt = `
      You are a botanist specializing in Araceae (aroids).
      Identify the plant in the image.
      
      Return a JSON object with:
      - genus (e.g. "Alocasia", "Syngonium", "Begonia")
      - species (e.g. "zebrina")
      - cultivar (e.g. "Reticulata")
      - confidence (0.0 to 1.0)
      - identification_notes (short explanation of traits used for ID)
      
      If you are unsure, provide your best guess but lower the confidence.
      If it's not a plant, return "unknown" for fields.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: "Identify this plant." },
            { type: "image_url", image_url: { url: image_base64 } }
          ] 
        },
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(completion.choices[0].message.content ?? "{}");

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("identifySpecies error", error);
    return new Response("Failed to identify species", { status: 500 });
  }
});

