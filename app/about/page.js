import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | Da Essence",
};

export default function AboutPage() {
  return (
    <div className="container section grid about-grid">
      <article className="card founder-card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>The Founder</h2>
        <div className="founder-layout">
          <figure className="about-figure founder-figure">
            <Image className="about-ceo founder-ceo-image" src="/assets/newCEO.png" alt="Abdul Jelyl Taiwo Yaqub" width={900} height={760} />
          </figure>
          <div>
            <h3 style={{ marginTop: 6 }}>Abdul Jelyl Taiwo Yaqub</h3>
            <p>
              Abdul Jelyl Taiwo Yaqub is the visionary founder of Da Essence Organic African Soap, a brand built on generations of
              African skincare heritage and refined through modern innovation.
            </p>
            <p>
              His journey began with a treasured family tradition passed down from his grandmother to his mother, who brought the
              authentic art of crafting African Black Soap from Nigeria to Ghana in the early 1930s. Growing up immersed in this rich
              legacy, Abdul Jelyl developed a deep appreciation for the craftsmanship, purity, and healing properties of authentic
              African Black Soap.
            </p>
            <p>
              Following his university education, he transformed this inherited knowledge into a premium wellness brand, elevating a
              time-honored tradition to meet the expectations of today's discerning global market. Under his leadership, Da Essence has
              become synonymous with authenticity, exceptional quality, and luxury natural skincare.
            </p>
            <p>
              Today, Da Essence Organic African Soap is proudly registered in Ghana and continues to craft and distribute premium organic
              African Black Soap to customers across Ghana and international markets, preserving a legacy of excellence while redefining
              African luxury.
            </p>
           
          </div>
        </div>
      </article>

      <article className="card about-story-card" style={{ padding: 18 }}>
        <div className="about-story-intro">
          <p className="about-eyebrow">Our Story</p>
          <h1 style={{ marginTop: 0 }}>Where heritage meets modern skincare</h1>
          <p>
            Da Essence is where generations of African skincare heritage meet modern craftsmanship. Inspired by the timeless tradition
            of Alata Samina, we create premium botanical soaps that cleanse, nourish, and reveal naturally radiant skin.
          </p>
          <p>
            Rooted in a family legacy spanning three generations, our founder, Abdul Jelyl Taiwo Yaqub, transformed a treasured heritage
            into a luxury skincare brand built on purity, trust, and measurable results.
          </p>
        </div>

        <div className="about-story-grid">
          <div>
            <h3 style={{ marginBottom: 8 }}>What guides us</h3>
            <ul className="about-story-list">
              <li>Authentic ingredients such as Aloe Vera, Shea Butter, Honey, Turmeric, Camwood, and essential oils.</li>
              <li>Thoughtful production standards that preserve the original spirit of traditional African black soap.</li>
              <li>Transparent communication that builds confidence for customers across Ghana and international markets.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: 8 }}>Why it matters</h3>
            <p>
              Every Da Essence product is crafted to deliver a calm, nourishing experience while honoring the rich legacy of African
              skincare. Our goal is to make natural care feel both timeless and modern.
            </p>
          </div>
        </div>
      </article>

      <div className="about-highlight-grid">
        <article className="card equal-height-card leadership-card" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Leadership and Recognition</h2>
          <p>
            Da Essence leadership is focused on product quality, transparent sourcing, and global standards for natural skincare.
            The CEO and the British Commissioner appearances on this page reflect the brand's commitment to credibility and long-term
            growth.
          </p>
          <div className="about-people-grid">
            <figure className="about-figure about-figure-fixed-width">
              <Image className="about-ceo about-ceo-main" src="/assets/newCEO.png" alt="Da Essence CEO" width={900} height={760} />
              <figcaption>Da Essence CEO: driving quality-first skincare and customer trust.</figcaption>
            </figure>
            <figure className="about-figure about-figure-fixed-width">
              <Image className="about-ceo about-commissioner" src="/assets/leader.png" alt="British Commissioner with Da Essence" width={900} height={760} />
              <figcaption>British Commissioner engagement supporting brand visibility and partnerships.</figcaption>
            </figure>
          </div>
        </article>

        <article className="card equal-height-card entrepreneurship-card" style={{ padding: 18 }}>
          <div className="entrepreneurship-layout">
            <Image
              src="/assets/entrepreneurship-training.png"
              alt="Entrepreneurship Training"
              width={900}
              height={900}
              sizes="(max-width: 1200px) 100vw, 32vw"
              unoptimized
              className="entrepreneurship-card-image"
            />
            <div className="entrepreneurship-copy">
              <p>
                Da Essence supports aspiring entrepreneurs with practical training on product sales, customer growth, and distribution.
                Join our program to learn how to build a skincare business around trusted Da Essence products.
              </p>
              <ul className="about-story-list entrepreneurship-benefits">
                <li>Learn how to grow a skincare business with confidence.</li>
                <li>Build customer trust through authentic product storytelling.</li>
                <li>Develop simple sales and distribution strategies that work.</li>
              </ul>
            </div>
          </div>
          <Link href="/about/entrepreneurship-training" className="btn btn-primary">
            View Training Program
          </Link>
        </article>

        <article className="card equal-height-card authenticity-card" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Authenticity and Trust</h2>
          <Image
            className="authenticity-card-image"
            src="/assets/product1page.png"
            alt="Da Essence organic soap product presentation"
            width={1200}
            height={900}
            sizes="(max-width: 1200px) 100vw, 32vw"
          />
          <p>
            We prioritize natural ingredients, tested production standards, and transparent customer communication from order to
            delivery.
          </p>
          <div className="flags-container" aria-label="Ghana and Nigeria flags">
            <figure className="flag-figure">
              <Image className="flag-image" src="/assets/ghana.png" alt="Ghana flag" width={180} height={120} />
              <figcaption>Ghana</figcaption>
            </figure>
            <figure className="flag-figure">
              <div className="flag-nigeria" role="img" aria-label="Nigeria flag" />
              <figcaption>Nigeria</figcaption>
            </figure>
          </div>
        </article>
      </div>
    </div>
  );
}
