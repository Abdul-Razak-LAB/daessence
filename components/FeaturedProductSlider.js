"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  { src: "/assets/da-essence-gold.jpg", alt: "Da Essence Gold" },
  { src: "/assets/da-essence-plus.jpg", alt: "Da Essence Plus" },
  { src: "/assets/da-essence-shea-butter.jpg", alt: "Da Essence Shea Butter" },
  { src: "/assets/bar-soap.jpg", alt: "Da Essence Bar Soap" },
  { src: "/assets/da-essence-standard-2.jpg", alt: "Da Essence Standard 2" },
  { src: "/assets/shower-gel.jpg", alt: "Da Essence Shower Gel" },
];

export function FeaturedProductSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="featured-slider" role="region" aria-roledescription="carousel" aria-label="Featured Da Essence products">
      {slides.map((slide, idx) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          width={760}
          height={620}
          className={`featured-slide ${idx === active ? "is-active" : ""}`}
          priority={idx === 0}
        />
      ))}

      <div className="featured-slider-dots">
        {slides.map((slide, idx) => (
          <button
            key={slide.src}
            type="button"
            className={`featured-slider-dot ${idx === active ? "is-active" : ""}`}
            onClick={() => setActive(idx)}
            aria-label={`Slide ${idx + 1}: ${slide.alt}`}
            aria-pressed={idx === active}
          />
        ))}
      </div>
    </div>
  );
}
