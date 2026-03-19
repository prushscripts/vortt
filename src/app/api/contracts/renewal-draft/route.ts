import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai/client";

export async function POST(req: NextRequest) {
  const { contractId } = await req.json();
  const contract = await prisma.maintenanceContract.findUnique({
    where: { id: contractId },
    include: { customer: true },
  });
  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prompt = `Write a short, friendly SMS renewal message for an HVAC maintenance contract.
Customer: ${contract.customer.firstName} ${contract.customer.lastName}
Contract: ${contract.tier} plan, $${contract.price}/year
Renewal date: ${contract.renewalDate.toLocaleDateString()}
Keep it under 160 characters. Friendly and professional. Return only SMS text.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 100,
  });

  return NextResponse.json({ draft: response.choices[0].message.content?.trim() ?? "" });
}
