import { addCartItemSchema } from "@/lib/validators";
import { addCartItem } from "@/lib/store";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const POST = withErrorHandling(async (request) => {
  const body = await request.json().catch(() => ({}));
  const parsed = addCartItemSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  const cart = await addCartItem(parsed.data);
  return ok({ cart });
});
