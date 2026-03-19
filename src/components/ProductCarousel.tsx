"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCta: (id: string) => void;
}

export default function ProductCarousel({ products, selectedId, onSelect, onCta }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const container = scrollRef.current;
      if (!container) return;
      const cards = container.querySelectorAll<HTMLElement>("[data-card]");
      const card = cards[index];
      if (!card) return;

      const scrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: smooth ? "smooth" : "instant" });
    },
    []
  );

  // On mount, scroll to selected card without animation
  useEffect(() => {
    const selectedIndex = products.findIndex((p) => p.id === selectedId);
    const idx = selectedIndex >= 0 ? selectedIndex : Math.floor(products.length / 2);
    requestAnimationFrame(() => {
      scrollToIndex(idx, false);
      setReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect center card on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const cards = container.querySelectorAll<HTMLElement>("[data-card]");
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((el, i) => {
          const cardCenter = el.offsetLeft + el.offsetWidth / 2;
          const distance = Math.abs(containerCenter - cardCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        onSelect(products[closestIndex].id);
      }, 60);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [products, onSelect]);

  const handleDotClick = (id: string) => {
    onSelect(id);
    const index = products.findIndex((p) => p.id === id);
    scrollToIndex(index);
  };

  const handleCardClick = (index: number) => {
    onSelect(products[index].id);
    scrollToIndex(index);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={`hide-scrollbar flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory px-[7.5vw] pt-2 pb-2 md:gap-6 md:px-[20vw] lg:px-[calc(50vw-200px)] transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product, i) => (
          <div key={product.id} data-card className="flex-shrink-0 snap-center">
            <ProductCard
              product={product}
              isSelected={product.id === selectedId}
              onClick={() => handleCardClick(i)}
              onCta={() => onCta(product.id)}
            />
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => handleDotClick(product.id)}
            className={`h-2 transition-all duration-300 ${
              product.id === selectedId
                ? "w-8 bg-primary"
                : "w-2 bg-gray-600"
            }`}
            aria-label={product.title}
          />
        ))}
      </div>
    </div>
  );
}
