import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";

export async function POST(req: NextRequest) {
  const { jobs, techs } = await req.json();

  if (!jobs?.length || !techs?.length) {
    return NextResponse.json({ assignments: [] });
  }

  const prompt = `You are an HVAC dispatch optimizer. Given a list of unassigned jobs and available technicians, suggest optimal assignments.

Consider:
- Geographic proximity (minimize drive time)
- Technician skill match (refrigerant jobs need certification)
- Job priority (emergencies first, always)
- Current workload balance

Jobs:
${JSON.stringify(jobs, null, 2)}

Available Technicians:
${JSON.stringify(techs, null, 2)}

Return JSON only with this exact structure:
{ "assignments": [{ "jobId": "string", "techId": "string", "reasoning": "string", "estimatedDriveMinutes": number }] }`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert HVAC dispatch optimizer. Return only valid JSON, no markdown.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content ?? '{"assignments":[]}';
  const result = JSON.parse(content);

  return NextResponse.json(result);
}
