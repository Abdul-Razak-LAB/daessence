import { patchCartItemSchema } from "@/lib/validators";
import { updateCartItem } from "@/lib/store";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const PATCH = withErrorHandling(async (request, { params }) => {
  const body = await request.json().catch(() => ({}));
  const parsed = patchCartItemSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  const { id } = await params;
  const cart = await updateCartItem(id, parsed.data.quantity);
  return ok({ cart });
});
