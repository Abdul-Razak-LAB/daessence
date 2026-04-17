import { createHmac } from "node:crypto";
import { saveEmailEvent } from "@/lib/store";
import { ok, fail, withErrorHandling } from "@/lib/http";

function verifySignature(raw, signature, secret) {
  if (!secret) return true;
  if (!signature) return false;
  const digest = createHmac("sha256", secret).update(raw).digest("hex");
  return digest === signature;
}

export const POST = withErrorHandling(async (request) => {
  const signature = request.headers.get("x-resend-signature");
  const raw = await request.text();

  if (!verifySignature(raw, signature, process.env.WEBHOOK_SECRET_RESEND)) {
    return fail("UNAUTHORIZED", "Invalid webhook signature", [], 401);
  }

  const payload = JSON.parse(raw || "{}");
  const templateTag = payload?.data?.tags?.find?.((t) => t.name === "template_key")?.value || "unknown";

  await saveEmailEvent({
    email: payload?.data?.to?.[0] || "unknown@example.com",
    templateKey: templateTag,
    providerMessageId: payload?.data?.email_id,
    status: payload?.type?.includes("bounced") ? "bounced" : payload?.type?.includes("failed") ? "failed" : "delivered",
    metadata: payload,
  });

  return ok({ ok: true });
});
