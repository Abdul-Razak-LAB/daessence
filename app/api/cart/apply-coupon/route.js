import { applyCouponSchema } from "@/lib/validators";
import { applyCoupon } from "@/lib/store";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const POST = withErrorHandling(async (request) => {
  const body = await request.json().catch(() => ({}));
  const parsed = applyCouponSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  try {
    const result = await applyCoupon(parsed.data.cartId, parsed.data.code);
    return ok(result);
  } catch (error) {
    return fail("INVALID_COUPON", error instanceof Error ? error.message : "Invalid coupon", [], 400);
  }
});
