import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai/client";
import { sendSMS } from "@/lib/twilio/client";
import { z } from "zod";

const draftSchema = z.object({
  contractId: z.string(),
  companyName: z.string(),
  action: z.enum(["draft", "send"]),
  draftMessage: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = draftSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { contractId, companyName, action, draftMessage } = parsed.data;

  const contract = await prisma.maintenanceContract.findUnique({
    where: { id: contractId },
    include: { customer: true },
  });

  if (!contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  if (action === "send") {
    if (!draftMessage) {
      return NextResponse.json({ error: "Message required to send" }, { status: 400 });
    }
    await sendSMS(contract.customer.phone, draftMessage);
    await prisma.maintenanceContract.update({
      where: { id: contractId },
      data: { outreachSent: true },
    });
    return NextResponse.json({ sent: true });
  }

  // Draft — generate via GPT-4o
  const equipmentList = (() => {
    const eq = contract.customer.equipment as Array<{ brand?: string; type?: string; model?: string }> | null;
    if (!eq || eq.length === 0) return "HVAC system";
    return eq.map((e) => `${e.brand} ${e.type}`).join(", ");
  })();

  const renewalDate = new Date(contract.renewalDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are writing a friendly, professional SMS for an HVAC company to send to a customer whose maintenance contract is coming up for renewal. Be warm, mention their specific equipment if available, and include a clear call to action. Keep it under 160 characters. No emojis. Return only the SMS text.",
      },
      {
        role: "user",
        content: `Customer: ${contract.customer.firstName} ${contract.customer.lastName}. Equipment: ${equipmentList}. Contract tier: ${contract.tier}. Price: $${contract.price}/year. Renewal date: ${renewalDate}. Company name: ${companyName}.`,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  const draft = completion.choices[0]?.message?.content?.trim() ?? "";

  return NextResponse.json({
    draft,
    customer: {
      name: `${contract.customer.firstName} ${contract.customer.lastName}`,
      phone: contract.customer.phone,
    },
    contract: {
      tier: contract.tier,
      price: contract.price,
      renewalDate: contract.renewalDate,
    },
  });
}
