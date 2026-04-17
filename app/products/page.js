import { ProductCatalogClient } from "@/components/ProductCatalogClient";
import { appConfig } from "@/lib/config";
import { getProductBySlug } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";

export const metadata = {
  title: "Products | Da Essence",
  description: "Browse Da Essence product options and buy instantly.",
};

export default async function ProductsPage() {
  const product = await getProductBySlug(appConfig.productSlug);
  const displayPrice = product
    ? moneyFromCents(product.price.saleAmountCents || product.price.amountCents, product.price.currency)
    : "$12.99";

  return <ProductCatalogClient baseProductId={product?.id || null} displayPrice={displayPrice} />;
}
