import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.22.1";

const openaiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
}

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
    const { description, care_notes } = await req.json();
    
    if (!description && !care_notes) {
      return new Response("Missing text to polish", { status: 400 });
    }

    const systemPrompt = `
      You are an expert copywriter for "Alivia's Apothecary", a high-end rare aroid studio. 
      Polish the provided plant description and/or care notes.
      
      Brand Voice:
      - High-end, calm, botanical, and confident.
      - Emphasize intentional growing, small-batch care, and specific traits (variegation, texture).
      - Avoid cheesy marketing clichés or overly mystical language.
      - Use sentence fragments where elegant. 
      - Focus on Syngonium, Alocasia, and Begonia nuances if present.
      
      Format:
      Return a JSON object with "description" and "care_notes" fields. Only polish the fields provided.
    `;

    const userContent = `
      Description to polish: "${description ?? ''}"
      Care notes to polish: "${care_notes ?? ''}"
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content ?? "{}");

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("enhanceDescription error", error);
    return new Response("Failed to enhance text", { status: 500 });
  }
});

