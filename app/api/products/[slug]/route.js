import { getProductBySlug } from "@/lib/store";
import { fail, ok, withErrorHandling } from "@/lib/http";

export const GET = withErrorHandling(async (_request, { params }) => {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return fail("NOT_FOUND", "Product not found", [], 404);
  }
  return ok(product);
});
