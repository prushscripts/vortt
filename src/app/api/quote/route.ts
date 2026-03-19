import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai/client";

export async function POST(req: NextRequest) {
  const { photoBase64 } = await req.json();

  if (!photoBase64) {
    return NextResponse.json({ error: "Photo required" }, { status: 400 });
  }

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an HVAC estimating assistant. Analyze the provided photo and return only valid JSON with no markdown.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this HVAC equipment photo and identify:
1) Equipment type and approximate age
2) Likely issue if visible
3) Recommended service type
4) Estimated job duration in hours
5) Suggested quote range in USD

Return JSON only with this exact structure:
{ "equipmentType": "string", "estimatedAge": "string", "likelyIssue": "string", "serviceType": "string", "durationHours": number, "quoteLow": number, "quoteHigh": number, "notes": "string" }`,
          },
          {
            type: "image_url",
            image_url: {
              url: photoBase64,
              detail: "high",
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const result = JSON.parse(content);
  return NextResponse.json(result);
}
