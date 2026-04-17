import { getOrderById, saveEmailEvent } from "@/lib/store";
import { sendOrderConfirmation } from "@/lib/email";
import { appConfig } from "@/lib/config";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const POST = withErrorHandling(async (_request, { params }) => {
  const order = await getOrderById(params.id);
  if (!order) {
    return fail("NOT_FOUND", "Order not found", [], 404);
  }

  const result = await sendOrderConfirmation({
    order: {
      ...order,
      totals: order.totals || { subtotalCents: 0, discountCents: 0, shippingCents: 0, totalCents: 0 },
      items: order.items || [],
      customer: order.customer || { fullName: "Customer" },
      orderNumber: order.order_number || order.orderNumber,
    },
    viewOrderUrl: `${appConfig.appBaseUrl}/order/${order.order_number || order.orderNumber}`,
    supportEmail: appConfig.supportEmail,
  });

  await saveEmailEvent({
    orderId: order.id,
    email: order.email,
    templateKey: "order_confirmation",
    providerMessageId: result.id,
    status: result.accepted ? "sent" : "failed",
    metadata: result,
  });

  return ok({ queued: result.accepted, template: "order_confirmation", orderId: order.id }, 202);
});
