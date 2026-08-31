import { ProductCatalogClient } from "@/components/ProductCatalogClient";
import { appConfig } from "@/lib/config";
import { getProductBySlug } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Products | Da Essence",
  description: "Browse Da Essence product options and buy instantly.",
};

export default async function ProductsPage() {
  const product = await getProductBySlug(appConfig.productSlug);
  const displayPrice = product
    ? moneyFromCents(product.price.saleAmountCents || product.price.amountCents, product.price.currency)
    : "$12.99";

  return (
    <div>
      <section className="section">
        <article className="card hero-banner product-hero-card">
          <div className="hero-banner-copy">
            <p className="hero-kicker">Our Products</p>
            <h1>Organic African Soap with Aloe Vera</h1>
            <p className="hero-banner-subtext">Natural cleansing bar crafted for clearer-looking, glowing skin.</p>
          </div>

          <div className="hero-banner-visual">
            <div className="hero-banner-image-wrap product-hero-image-wrap">
              <Image
                src="/assets/de1.png"
                alt="Our Products hero banner"
                fill
                className="hero-banner-image product-hero-image"
                priority
              />
            </div>

            <div className="hero-actions">
              <Link href="/products/organic-african-soap-aloe-vera" className="btn btn-primary">
                Shop the hero soap
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact us
              </Link>
            </div>
          </div>
        </article>
      </section>

      <ProductCatalogClient baseProductId={product?.id || null} displayPrice={displayPrice} />
    </div>
  );
}
