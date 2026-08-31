import Image from "next/image";
import Link from "next/link";
import { appConfig } from "@/lib/config";
// banner image should be placed in public/assets/ to be served at /assets/...
import { getProductBySlug } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";
import { FeaturedProductSlider } from "@/components/FeaturedProductSlider";

export async function generateMetadata() {
  return {
    title: "Da Essence | Organic African Soap with Aloe Vera",
    description: "Natural African soap and skincare ritual using aloe vera, shea butter, and cocoa for balanced, glowing skin.",
    openGraph: {
      title: "Da Essence | Organic African Soap",
      description: "Shop Da Essence natural African soap with aloe vera for gentle daily cleansing and radiant skin.",
      type: "website",
      url: appConfig.appBaseUrl,
      images: [
        {
          url: `${appConfig.appBaseUrl}/assets/blacksoap.jpg`,
          width: 1200,
          height: 630,
          alt: "Da Essence Organic African Soap",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Da Essence",
      description: "Organic African soap infused with aloe vera for gentle cleansing and glow.",
      images: ["/assets/blacksoap.jpg"],
    },
  };
}

export default async function HomePage() {
  const product = await getProductBySlug(appConfig.productSlug);
  const displayPrice = product
    ? moneyFromCents(product.price.saleAmountCents || product.price.amountCents, product.price.currency)
    : "$12.99";

  const productName = product?.name || "Organic African Soap with Aloe Vera";
  const productDescription =
    product?.shortDescription ||
    "Da Essence natural cleansing bar crafted for clearer-looking, glowing skin with a gentle aloe vera infusion.";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: appConfig.appName,
    url: appConfig.appBaseUrl,
    description: "Natural African skincare and soap with aloe vera, rooted in heritage and modern care.",
    publisher: {
      "@type": "Organization",
      name: appConfig.appName,
      url: appConfig.appBaseUrl,
    },
  };

  return (
    <div className="container page-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <section className="hero-grid section">
        <article className="hero-media card">
          <div className="hero-image-wrap">
            <Image
              src="/assets/da-essence-home-page-banner.png"
              alt="Da Essence Organic African Soap banner"
              width={1200}
              height={700}
              className="hero-image"
              priority
            />
          </div>

          <div className="hero-banner-card">
            <p className="eyebrow">Best seller</p>
            <h2>{productName}</h2>
            <p>{productDescription}</p>
            <div className="hero-banner-footer">
              <span className="featured-price">{displayPrice}</span>
              <Link className="btn btn-primary btn-sm" href={`/products/${appConfig.productSlug}`}>
                Buy now
              </Link>
            </div>
          </div>
        </article>

        <article className="hero-copy card">
          <p className="eyebrow">Cleanse, calm, and glow daily</p>
          <h1>Organic African soap with aloe vera for balanced, radiant skin</h1>
          <p className="hero-text">
            Da Essence blends African skincare tradition, plant-powered ingredients, and modern quality so your skin feels nourished,
            refreshed, and visibly brighter without harsh chemicals.
          </p>

          <div className="hero-values">
            <div>
              <strong>100% natural</strong>
              <span>Plant-based cleansing</span>
            </div>
            <div>
              <strong>Glow support</strong>
              <span>Aloe vera and shea comfort</span>
            </div>
            <div>
              <strong>Fast service</strong>
              <span>Shipping across Ghana & Nigeria</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/products/${appConfig.productSlug}`}>
              Shop the hero soap
            </Link>
            <Link className="btn btn-secondary" href="/about">
              Learn our story
            </Link>
          </div>
        </article>
      </section>

      <section className="section trust-strip" aria-label="Trust signals">
        <article className="card trust-card">
          <div className="trust-pill-grid">
            <div className="pill">
              <strong>4.9/5 customer rating</strong>
              <span>Real feedback from happy skin care users</span>
            </div>
            <div className="pill">
              <strong>Premium natural care</strong>
              <span>Aloe vera, shea butter, and cocoa ingredients</span>
            </div>
            <div className="pill">
              <strong>Secure checkout</strong>
              <span>Fast confirmation and order tracking</span>
            </div>
          </div>
        </article>
      </section>

      <section className="section featured-shell">
        <div className="featured-heading">
          <div>
            <p className="eyebrow">Featured ritual</p>
            <h2>Skincare that feels rooted in heritage and results</h2>
          </div>
          <Link href={`/products/${appConfig.productSlug}`} className="text-link">
            View full product page
          </Link>
        </div>

        <article className="card featured-product-row">
          <FeaturedProductSlider />
          <div className="featured-product-copy">
            <p className="eyebrow">Featured hero</p>
            <h3>{productName}</h3>
            <p>{productDescription}</p>
            <p className="featured-price">{displayPrice}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={`/products/${appConfig.productSlug}`}>
                Buy now
              </Link>
              <Link className="btn btn-secondary" href="/cart">
                Review cart
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="section benefit-grid">
        <article className="card benefit-card">
          <Image
            src="/assets/aloe-vera-slices-skin-care-scaled.jpg"
            alt="Aloe vera ingredients for calming skin"
            width={640}
            height={430}
            className="benefit-image"
          />
          <div>
            <p className="eyebrow">Aloe Vera balance</p>
            <h3>Support gentle cleansing with hydration</h3>
            <p>Our aloe vera blend helps calm skin and keep moisture in while removing impurities and environmental buildup.</p>
          </div>
        </article>

        <article className="card benefit-card shea-benefit-card">
          <Image
            src="/assets/glow-now.jpg"
            alt="Shea butter for nourishing skin"
            width={640}
            height={430}
            className="benefit-image"
          />
          <div>
            <p className="eyebrow">Shea moisture</p>
            <h3>Gentle nourishment after every wash</h3>
            <p>Shea butter in our formula helps skin feel soft and replenished, not stripped, with every cleansing ritual.</p>
          </div>
        </article>

        <article className="card benefit-card">
          <Image
            src="/assets/cocoa-pod-scaled.jpg"
            alt="Cocoa pod heritage ingredient"
            width={640}
            height={430}
            className="benefit-image benefit-image-cocoa"
          />
          <div>
            <p className="eyebrow">Cocoa heritage</p>
            <h3>Authentic ingredients rooted in tradition</h3>
            <p>Cocoa and botanical extracts connect modern care to authentic African soap tradition for a richer skincare experience.</p>
          </div>
        </article>
      </section>

      <section className="section card">
        <div className="story-banner-copy">
          <h2>Why customers choose Da Essence</h2>
          <p>
            Customers trust Da Essence for product transparency, authentic ingredient storytelling, and dependable delivery updates from
            checkout to doorstep.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Talk to Da Essence support
          </Link>
        </div>
      </section>
    </div>
  );
}
