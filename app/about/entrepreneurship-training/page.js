import Image from "next/image";
import Link from "next/link";
import { TrainingInterestForm } from "@/components/TrainingInterestForm";

export const metadata = {
  title: "Entrepreneurship Training | Da Essence",
  description: "Da Essence entrepreneurship training program for aspiring beauty and skincare business owners.",
};

export default function EntrepreneurshipTrainingPage() {
  return (
    <div className="container section training-page">
      <article className="card training-hero-card">
        <p className="hero-kicker">Da Essence Community Growth</p>
        <h1 className="training-hero-title">Entrepreneurship Training Program</h1>
        <p className="training-hero-copy">
          Da Essence Entrepreneurship Training equips aspiring founders, distributors, and skincare sellers with practical guidance
          to build profitable and sustainable product businesses in their local markets.
        </p>
      </article>

      <section className="grid training-main-grid">
        <article className="card training-details-card">
          <h2 style={{ marginTop: 0 }}>What You Learn</h2>
          <ul>
            <li>How to start and position a skincare business with Da Essence products</li>
            <li>Customer acquisition, repeat sales, and trust-building strategies</li>
            <li>Social selling and digital marketing fundamentals</li>
            <li>Inventory planning, pricing, and simple business bookkeeping</li>
            <li>Distributor and partnership growth models</li>
          </ul>

          <h2>Program Format</h2>
          <p>
            Training includes guided sessions, practical assignments, and post-training mentorship support to help participants
            launch confidently.
          </p>
          <div className="training-back-link-wrap">
            <Link href="/about" className="btn btn-secondary">
              Back to About.
            </Link>
          </div>
        </article>

        <article className="card training-banner-card">
          <Image
            src="/assets/entrepreneurship-training.png"
            alt="Da Essence entrepreneurship training"
            width={900}
            height={900}
            sizes="(max-width: 900px) 100vw, 42vw"
            unoptimized
            className="training-banner-image"
          />
        </article>
      </section>

      <section className="section training-form-section">
        <TrainingInterestForm />
      </section>
    </div>
  );
}
