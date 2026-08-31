import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Contact | Da Essence",
};

export default function ContactPage() {
  return (
    <div className="container section">
      <article className="card hero-banner contact-hero-card">
        <div className="hero-banner-copy">
          <p className="hero-kicker">Contact Us</p>
          <h1>We’d love to hear from you</h1>
          <p className="hero-banner-subtext">Reach out for inquiries, orders, partnerships, or any other information.</p>
        </div>

        <div className="hero-banner-visual">
          <div className="hero-banner-image-wrap">
            <Image
              src="/assets/de1.png"
              alt="Da Essence contact hero image"
              fill
              className="hero-banner-image"
              priority
            />
          </div>

          <div className="hero-actions">
            <Link href="/" className="btn btn-secondary">
              Back to home
            </Link>
            <a href="mailto:daessenceorganic@gmail.com" className="btn btn-primary">
              Email us
            </a>
          </div>
        </div>
      </article>

      <ContactForm />
    </div>
  );
}
