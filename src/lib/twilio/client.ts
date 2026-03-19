import twilio from "twilio";

export const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER ?? "";

let _client: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!_client) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      throw new Error("Twilio credentials not configured");
    }
    _client = twilio(sid, token);
  }
  return _client;
}

export async function sendSMS(to: string, body: string) {
  const client = getTwilioClient();
  return client.messages.create({
    body,
    from: TWILIO_PHONE,
    to,
  });
}
