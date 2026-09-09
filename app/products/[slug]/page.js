import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductBySlug } from "@/lib/store";
import { moneyFromCents } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  const imageUrl = product.images[0]?.path || "/assets/blacksoap.jpg";

  return {
    title: `${product.name} | Da Essence`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Da Essence`,
      description: product.shortDescription,
      type: "website",
      url: `https://daessence.com/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.path),
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Da Essence",
    },
    offers: {
      "@type": "Offer",
      url: `https://daessence.com/products/${slug}`,
      priceCurrency: product.price.currency,
      price: ((product.price.saleAmountCents || product.price.amountCents) / 100).toFixed(2),
      availability:
        product.inventory.status === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="product-layout">
        <section>
          <Image
            className="gallery-main"
            src={product.images[0]?.path || "/assets/blacksoap.jpg"}
            alt={product.images[0]?.alt || product.name}
            width={900}
            height={900}
          />
          <div className="gallery-grid">
            {product.images.slice(1, 5).map((img) => (
              <Image key={img.path} src={img.path} alt={img.alt || product.name} width={240} height={240} />
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: 18 }}>
          <p style={{ color: "#0f5c44", fontWeight: 700, marginBottom: 8 }}>Hero Product</p>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <p style={{ color: "#5f665b" }}>{product.longDescription}</p>

          <h3>Benefits</h3>
          <ul>
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          <h3>Ingredients</h3>
          <p>{product.ingredients.join(", ")}</p>

          <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {moneyFromCents(product.price.saleAmountCents || product.price.amountCents, product.price.currency)}
          </p>
          {product.price.saleAmountCents ? (
            <p style={{ marginTop: 0, color: "#5f665b" }}>
              <s>{moneyFromCents(product.price.amountCents, product.price.currency)}</s>
            </p>
          ) : null}

          <p style={{ marginTop: 2 }}>Status: {product.inventory.status.replace("_", " ")}</p>
          <AddToCartButton productId={product.id} />
        </section>
      </div>
    </div>
  );
}
