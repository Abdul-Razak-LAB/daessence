import { contactSchema } from "@/lib/validators";
import { createContactMessage, saveEmailEvent } from "@/lib/store";
import { sendContactAutoReply, sendContactSupportNotification } from "@/lib/email";
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
    try {
      const autoReplyResult = await sendContactAutoReply({
        email: parsed.data.email,
        name: parsed.data.name,
      });

      await saveEmailEvent({
        email: parsed.data.email,
        templateKey: "contact_auto_reply",
        providerMessageId: autoReplyResult.id,
        status: autoReplyResult.accepted ? "sent" : "failed",
        metadata: autoReplyResult,
      });
    } catch (error) {
      await saveEmailEvent({
        email: parsed.data.email,
        templateKey: "contact_auto_reply",
        status: "failed",
        metadata: { error: error instanceof Error ? error.message : "Unknown email send error" },
      });
    }

    try {
      const supportResult = await sendContactSupportNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        submittedAt: created.createdAt,
      });

      await saveEmailEvent({
        email: appConfig.contactInboxEmail,
        templateKey: "contact_support_notification",
        providerMessageId: supportResult.id,
        status: supportResult.accepted ? "sent" : "failed",
        metadata: {
          ...supportResult,
          fromContactEmail: parsed.data.email,
        },
      });
    } catch (error) {
      await saveEmailEvent({
        email: appConfig.contactInboxEmail,
        templateKey: "contact_support_notification",
        status: "failed",
        metadata: { error: error instanceof Error ? error.message : "Unknown support email send error" },
      });
    }
  }

  return ok(created, 201);
});
