import { checkoutSchema } from "@/lib/validators";
import { createOrderFromCart, getCart, saveEmailEvent } from "@/lib/store";
import { sendOrderConfirmation } from "@/lib/email";
import { appConfig } from "@/lib/config";
import { orderNumber } from "@/lib/utils";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const POST = withErrorHandling(async (request) => {
  const body = await request.json().catch(() => ({}));
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  const cart = await getCart(parsed.data.cartId);
  if (!cart || cart.items.length === 0) {
    return fail("EMPTY_CART", "Cart is empty or missing", [], 422);
  }

  const generatedOrderNumber = orderNumber();
  const order = await createOrderFromCart({
    cartId: parsed.data.cartId,
    customer: parsed.data.customer,
    shippingAddress: parsed.data.shippingAddress,
    payment: parsed.data.payment,
    orderNumber: generatedOrderNumber,
    discountCents: cart.coupon?.discountCents || 0,
  });

  const result = await sendOrderConfirmation({
    order: {
      ...order,
      customer: parsed.data.customer,
    },
    viewOrderUrl: `${appConfig.appBaseUrl}/order/${generatedOrderNumber}`,
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

  return ok(
    {
      order: {
        id: order.id,
        orderNumber: generatedOrderNumber,
        status: "paid",
        email: order.email,
        totals: order.totals,
      },
    },
    201
  );
});
