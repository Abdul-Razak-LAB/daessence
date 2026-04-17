import { appConfig } from "@/lib/config";
import { sendAbandonedCart } from "@/lib/email";
import { listAbandonedCarts, markAbandonedReminderSent, saveEmailEvent } from "@/lib/store";
import { fail, ok, withErrorHandling } from "@/lib/http";

function isAuthorized(request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return true;
  const header = request.headers.get("authorization") || "";
  return header === `Bearer ${token}`;
}

export const POST = withErrorHandling(async (request) => {
  if (!isAuthorized(request)) {
    return fail("UNAUTHORIZED", "Missing or invalid admin token", [], 401);
  }

  const carts = await listAbandonedCarts(120);
  let sent = 0;

  for (const cart of carts) {
    const result = await sendAbandonedCart({
      email: cart.email,
      cartId: cart.id,
      items: cart.items,
      resumeCheckoutUrl: `${appConfig.appBaseUrl}/checkout`,
    });

    await saveEmailEvent({
      cartId: cart.id,
      email: cart.email,
      templateKey: "abandoned_cart_reminder",
      providerMessageId: result.id,
      status: result.accepted ? "sent" : "failed",
      metadata: result,
    });

    if (result.accepted || result.skipped) {
      await markAbandonedReminderSent(cart.id);
      sent += 1;
    }
  }

  return ok({ processed: carts.length, remindersMarked: sent });
});
