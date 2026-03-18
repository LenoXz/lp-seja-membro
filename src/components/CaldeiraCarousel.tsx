"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const images = [
  { src: "/caldeira1.jpg", alt: "Instituto Caldeira - Eventos" },
  { src: "/caldeira2.jpg", alt: "Instituto Caldeira - Comunidade" },
  { src: "/caldeira3.jpg", alt: "Instituto Caldeira - Networking" },
  { src: "/caldeira4.jpg", alt: "Instituto Caldeira - Coworking" },
  { src: "/caldeira5.jpg", alt: "Instituto Caldeira - Espaço" },
  { src: "/caldeira6.jpg", alt: "Instituto Caldeira - Palestras" },
];

export default function CaldeiraCarousel() {
  const [current, setCurrent] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.15 });

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section ref={ref} className="relative bg-black">
      {/* Main image */}
      <div
        className={`relative w-full h-[50vh] md:h-[70vh] overflow-hidden transition-all duration-1000 ${
          isInView ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                i === current ? "scale-100" : "scale-105"
              }`}
              sizes="100vw"
              priority={i === 0}
              unoptimized
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Text overlay */}
        <div className="absolute bottom-8 left-5 md:bottom-12 md:left-8 z-10">
          <p
            className={`mb-2 font-body text-xs font-bold uppercase tracking-[3.5px] text-primary transition-all duration-700 delay-300 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            Conheça o Caldeira
          </p>
          <h2
            className={`font-display text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.1] text-white max-w-lg transition-all duration-700 delay-500 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            O hub de inovação mais
            <br />
            vibrante do Brasil
          </h2>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-white/30 bg-black/40 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 md:left-6 md:h-12 md:w-12"
          aria-label="Foto anterior"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-white/30 bg-black/40 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 md:right-6 md:h-12 md:w-12"
          aria-label="Próxima foto"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 py-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-gray-600 hover:bg-gray-400"
            }`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
