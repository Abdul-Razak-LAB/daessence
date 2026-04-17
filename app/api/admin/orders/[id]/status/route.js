import { adminStatusSchema } from "@/lib/validators";
import { getOrderById, saveEmailEvent, updateOrderStatus } from "@/lib/store";
import { sendShippingUpdate } from "@/lib/email";
import { appConfig } from "@/lib/config";
import { fail, ok, withErrorHandling } from "@/lib/http";

function isAuthorized(request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return true;
  const header = request.headers.get("authorization") || "";
  return header === `Bearer ${token}`;
}

export const PATCH = withErrorHandling(async (request, { params }) => {
  if (!isAuthorized(request)) {
    return fail("UNAUTHORIZED", "Missing or invalid admin token", [], 401);
  }

  const body = await request.json().catch(() => ({}));
  const parsed = adminStatusSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  const updated = await updateOrderStatus(params.id, parsed.data.status, parsed.data.trackingNumber, parsed.data.carrierName);
  if (!updated) {
    return fail("NOT_FOUND", "Order not found", [], 404);
  }

  if (parsed.data.status === "shipped") {
    const order = await getOrderById(params.id);
    const mail = await sendShippingUpdate({
      order,
      trackingNumber: parsed.data.trackingNumber,
      carrierName: parsed.data.carrierName,
      trackingUrl: `${appConfig.appBaseUrl}/order/${updated.order_number || updated.orderNumber}`,
    });

    await saveEmailEvent({
      orderId: params.id,
      email: updated.email,
      templateKey: "shipping_update",
      providerMessageId: mail.id,
      status: mail.accepted ? "sent" : "failed",
      metadata: mail,
    });
  }

  return ok({
    id: updated.id,
    orderNumber: updated.order_number || updated.orderNumber,
    status: updated.status,
  });
});
