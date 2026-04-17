import Image from "next/image";
import Link from "next/link";
import { appConfig } from "@/lib/config";
import { getProductBySlug } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";
import { FeaturedProductSlider } from "@/components/FeaturedProductSlider";

export default async function HomePage() {
  const product = await getProductBySlug(appConfig.productSlug);
  const displayPrice = product
    ? moneyFromCents(product.price.saleAmountCents || product.price.amountCents, product.price.currency)
    : "$12.99";

  return (
    <div className="container section home-shell">
      <section className="market-hero">
        <aside className="card category-panel">
          <h3>Da Essence Collections</h3>
          <ul>
            <li>Organic African Soap</li>
            <li>Aloe Vera Skin Support</li>
            <li>Shea Butter Moisture Care</li>
            <li>Cocoa-Infused Skin Rituals</li>
            <li>Acne and Glow Essentials</li>
            <li>Body Care Bundles</li>
          </ul>
          <Link href="/products" className="btn btn-primary">
            Browse Da Essence Shop
          </Link>
        </aside>

        <article className="card hero-banner">
          <div className="hero-banner-copy">
            <p className="hero-kicker">Da Essence Signature Formula</p>
            <h1>Organic African Soap with Aloe Vera for Clear, Radiant Skin</h1>
            <p>
              Da Essence combines African skincare tradition with modern quality controls. Start your routine with our hero soap
              crafted for cleansing, balance, and visible glow.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/products/${appConfig.productSlug}`}>
                Shop the Hero Soap
              </Link>
              <Link className="btn btn-secondary" href="/about">
                Discover Da Essence Story
              </Link>
            </div>
          </div>
          <div className="hero-banner-image-wrap">
            <Image src="/assets/blacksoap.jpg" alt="Da Essence Organic African Soap" width={1100} height={900} className="hero-banner-image" priority />
          </div>
        </article>
      </section>

      <section className="section promo-grid">
        <article className="card promo-card">
          <Image src="/assets/acne-solution-now.jpg" alt="Da Essence acne support" width={640} height={430} className="promo-card-image" />
          <div>
            <p className="promo-label">Da Essence Skin Clarity Focus</p>
            <h3>Target Daily Buildup with the Da Essence Cleansing Ritual</h3>
            <p>Use the Da Essence aloe vera soap consistently to support clean, balanced skin and confidence through the day.</p>
          </div>
        </article>
        <article className="card promo-card">
          <Image src="/assets/glow-now.jpg" alt="Da Essence glow support" width={640} height={430} className="promo-card-image" />
          <div>
            <p className="promo-label">Da Essence Glow Ritual</p>
            <h3>Build a Brighter Routine with Da Essence Botanical Care</h3>
            <p>Pair Da Essence cleansing with ingredient-rich moisture support for smoother texture and healthy-looking radiance.</p>
          </div>
        </article>
      </section>

      <section className="section featured-shell">
        <div className="featured-heading">
          <h2>Featured Da Essence Product</h2>
          <Link href={`/products/${appConfig.productSlug}`}>View Full Product Details</Link>
        </div>
        <article className="card featured-product-row">
          <FeaturedProductSlider />
          <div className="featured-product-copy">
            <p className="hero-kicker">Da Essence Hero Product</p>
            <h3>{product?.name || "Organic African Soap with Aloe Vera"}</h3>
            <p>
              {product?.shortDescription ||
                "Da Essence natural cleansing bar crafted for clearer-looking, glowing skin with a gentle aloe vera infusion."}
            </p>
            <p className="featured-price">{displayPrice}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/products/${appConfig.productSlug}`}>
                Buy Da Essence Soap
              </Link>
              <Link className="btn btn-secondary" href="/cart">
                Review Da Essence Cart
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="section ingredient-grid">
        <article className="card ingredient-card">
          <Image src="/assets/aloe-vera-slices-skin-care-scaled.jpg" alt="Da Essence aloe vera ingredient" width={600} height={430} className="ingredient-image" />
          <h3>Aloe Vera in Da Essence Formulation</h3>
          <p>Da Essence uses aloe vera support to keep cleansing effective while remaining kind to daily skin routines.</p>
        </article>
        <article className="card ingredient-card">
          <Image src="/assets/shea-butter.jpg" alt="Da Essence shea ingredient" width={600} height={430} className="ingredient-image" />
          <h3>Shea Butter Support in Da Essence Care</h3>
          <p>Da Essence includes shea-rich components to help skin feel nourished after cleansing.</p>
        </article>
        <article className="card ingredient-card ingredient-card-cocoa">
          <Image
            src="/assets/cocoa-pod-scaled.jpg"
            alt="Da Essence cocoa pod ingredient"
            width={600}
            height={430}
            className="ingredient-image ingredient-image-cocoa ingredient-image-cocoa-desktop"
          />
          <Image
            src="/assets/cocoa-pod-1scaled.jpg"
            alt="Da Essence cocoa pod ingredient"
            width={600}
            height={430}
            className="ingredient-image ingredient-image-cocoa ingredient-image-cocoa-mobile"
          />
          <h3>Cocoa Heritage in Da Essence Tradition</h3>
          <p>Da Essence cocoa pod heritage supports our traditional black soap story.</p>
        </article>
      </section>

      <section className="section story-banner card">
        <Image src="/assets/about-image.jpg" alt="Da Essence brand story" width={1300} height={700} className="story-banner-image" />
        <div className="story-banner-copy">
          <h2>Why Customers Choose Da Essence</h2>
          <p>
            Customers trust Da Essence for product transparency, authentic ingredient storytelling, and dependable delivery updates
            from checkout to doorstep.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Talk to Da Essence Support
          </Link>
        </div>
      </section>
    </div>
  );
}
