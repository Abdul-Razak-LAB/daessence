import { cartCreateSchema } from "@/lib/validators";
import { createCart, getCart } from "@/lib/store";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const GET = withErrorHandling(async (request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return fail("VALIDATION_ERROR", "Missing cart id", [], 400);
  }

  const cart = await getCart(id);
  if (!cart) {
    return fail("NOT_FOUND", "Cart not found", [], 404);
  }

  return ok(cart);
});

export const POST = withErrorHandling(async (request) => {
  const body = await request.json().catch(() => ({}));
  const parsed = cartCreateSchema.safeParse(body);

  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payload", parsed.error.issues, 400);
  }

  const cart = await createCart(parsed.data.email);
  return ok(cart, 201);
});
