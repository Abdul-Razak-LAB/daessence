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
            <Image className="about-ceo founder-ceo-image" src="/assets/ceo.jpg" alt="Abdul Jelyl Taiwo Yaqub" width={900} height={760} />
            <figcaption>Abdul Jelyl Taiwo Yaqub, Founder of Da Essence.</figcaption>
          </figure>
          <div>
            <h3 style={{ marginTop: 6 }}>Abdul Jelyl Taiwo Yaqub</h3>
            <p>
              The founder, Abdul Jelyl Taiwo Yaqub inherited the golden legacy bequeathed to his mother who had learnt how to
              prepare the product from her mother in law who learnt how to produce African black soap from early ages in Nigeria
              and migrated to Ghana in the early 1930's (over 80 years ago).
            </p>
            <p>
              Abdul Jelyl Taiwo Yaqub growing up with the mother developed the passion to learn and research into the product. It
              was after his Senior High School education that he fully committed to his mother's business. After his university
              education, he took over from his elderly mother and began the journey to explore which gave birth to Da Essence
              Organic African Soap about ten years ago.
            </p>
            <p>
              He then incorporated Da Essence with the Registrar General's Department of Ghana under the Companies Acts as brand
              name under which variety of Organic African Soap are manufactured, packaged and supplied to local and international
              markets.
            </p>
          </div>
        </div>
      </article>

      <article className="card" style={{ padding: 18 }}>
        <h1 style={{ marginTop: 0 }}>Our Story</h1>
        <p>
          Da Essence is built on African skincare wisdom and practical modern production. Our Organic African Soap with Aloe Vera
          is designed to give consistent cleansing, confidence, and glow.
        </p>
        <p>
          We focus on ingredient transparency and product consistency while preserving origin stories from Ghana and the broader
          West African black soap legacy.
        </p>
        <h3 style={{ marginBottom: 8 }}>How the name Alata Semina Came</h3>
        <p>
          Based on the history behind the soap, the name "Alata Semina" was coined within the Ghanaian community for the soap.
          Alata Semina was a breakthrough discovery and since then many homes developed an addiction to the soap. Black soap's
          reputation grew nationwide within the shortest time, ultimately due to its high natural potency for treatment of all
          types of skin diseases, exfoliating qualities, and giving the skin a perfect look and freshness.
        </p>
        <p>
          The journey of transformation and value addition began under the supervision of Abdul Jelyl Taiwo Yaqub; a third
          generation in the family business with the establishment of Da Essence Organic African Soap Laboratory with indigenous
          organic medicinal plants and herbs extracts added in formulating the quality of Da Essence products under strict
          hygienic conditions.
        </p>
        <p>
          Da Essence Organic African Soap is now perfected through the right technology and science to deliver great results and
          satisfaction. In pursuit of the exceptional, extracts from Camwood, Turmeric, Sandal Wood, Essential oils, Aloe Vera,
          Honey, and Shea butter which have antibacterial and antiseptic properties to help fight acne, eczema, pimples,
          dermatitis, and psoriasis, reduce inflammation, adds a natural glow to the skin, it also acts as a moisturizer, helps
          fight sunburn, improves skin texture.
        </p>
      </article>

      <article className="card" style={{ overflow: "hidden" }}>
        <Image className="about-cover" src="/assets/about-image.jpg" alt="Da Essence story" width={900} height={800} />
      </article>

      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Leadership and Recognition</h2>
        <p>
          Da Essence leadership is focused on product quality, transparent sourcing, and global standards for natural skincare.
          The CEO and the British Commissioner appearances on this page reflect the brand's commitment to credibility and long-term
          growth.
        </p>
        <div className="about-people-grid">
          <figure className="about-figure about-figure-fixed-width">
            <Image className="about-ceo about-ceo-main" src="/assets/ceo.jpg" alt="Da Essence CEO" width={900} height={760} />
            <figcaption>Da Essence CEO: driving quality-first skincare and customer trust.</figcaption>
          </figure>
          <figure className="about-figure about-figure-fixed-width">
            <Image className="about-ceo about-commissioner" src="/assets/British-Commissioner.jpeg" alt="British Commissioner with Da Essence" width={900} height={760} />
            <figcaption>British Commissioner engagement supporting brand visibility and partnerships.</figcaption>
          </figure>
          <figure className="about-figure about-figure-fixed-width">
            <Image className="about-ceo about-commissioner" src="/assets/74117546.jpg" alt="British High Commissioner with Da Essence" width={900} height={760} />
            <figcaption>British High Commissioner image highlighting Da Essence recognition and international visibility.</figcaption>
          </figure>
        </div>
      </article>

      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Entrepreneurship Training</h2>
        <p>
          Da Essence supports aspiring entrepreneurs with practical training on product sales, customer growth, and distribution.
          Join our program to learn how to build a skincare business around trusted Da Essence products.
        </p>
        <Link href="/about/entrepreneurship-training" className="btn btn-primary">
          View Training Program
        </Link>
      </article>

      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Authenticity and Trust</h2>
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
  );
}
