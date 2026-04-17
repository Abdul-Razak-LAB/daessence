import { contactSchema } from "@/lib/validators";
import { createContactMessage, saveEmailEvent } from "@/lib/store";
import { sendAbandonedCart } from "@/lib/email";
import { appConfig } from "@/lib/config";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const POST = withErrorHandling(async (request) => {
  const body = await request.json().catch(() => ({}));
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  const created = await createContactMessage(parsed.data);

  if (process.env.RESEND_API_KEY) {
    const result = await sendAbandonedCart({
      email: parsed.data.email,
      cartId: created.id,
      items: [{ name: "Support Request Received", quantity: 1, lineTotalCents: 0 }],
      resumeCheckoutUrl: `${appConfig.appBaseUrl}/contact`,
    });

    await saveEmailEvent({
      cartId: created.id,
      email: parsed.data.email,
      templateKey: "contact_auto_reply",
      providerMessageId: result.id,
      status: result.accepted ? "sent" : "failed",
      metadata: result,
    });
  }

  return ok(created, 201);
});
