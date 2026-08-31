"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  { src: "/assets/about12.png", alt: "Da Essence founder story" },
  { src: "/assets/leader.png", alt: "Da Essence leadership" },
  { src: "/assets/newCEO.png", alt: "Da Essence CEO" },
  { src: "/assets/de1.png", alt: "Da Essence product showcase" },
  { src: "/assets/bar-soap.jpg", alt: "Da Essence Bar Soap" },
];

const MAX_SLIDES = 5;

export function FeaturedProductSlider() {
  const [active, setActive] = useState(0);
  const visibleSlides = slides.slice(0, MAX_SLIDES);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % visibleSlides.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [visibleSlides.length]);

  return (
    <div className="featured-slider" role="region" aria-roledescription="carousel" aria-label="Featured Da Essence products">
      {visibleSlides.map((slide, idx) => (
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
        {visibleSlides.map((slide, idx) => (
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
