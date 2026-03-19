import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/twilio/client";
import { z } from "zod";

const schema = z.object({
  to: z.string(),
  body: z.string(),
  type: z.enum(["tech_assignment", "customer_notification", "renewal", "review"]).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const message = await sendSMS(parsed.data.to, parsed.data.body);
    return NextResponse.json({ sid: message.sid, status: message.status });
  } catch (error) {
    console.error("SMS send error:", error);
    return NextResponse.json({ error: "SMS failed to send" }, { status: 500 });
  }
}
