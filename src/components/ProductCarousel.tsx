"use client";

import { useRef, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ProductCarousel({ products, selectedId, onSelect }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.children[index] as HTMLElement;
    if (!card) return;

    const scrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, []);

  // Detect which card is closest to center after scroll ends
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        Array.from(container.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const cardCenter = el.offsetLeft + el.offsetWidth / 2;
          const distance = Math.abs(containerCenter - cardCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        onSelect(products[closestIndex].id);
      }, 80);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [products, onSelect]);

  const handleSelect = (id: string) => {
    onSelect(id);
    const index = products.findIndex((p) => p.id === id);
    scrollToCard(index);
  };

  return (
    <div className="relative">
      {/* Carousel container */}
      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-[7.5vw] pb-2 md:gap-6 md:px-[20vw] lg:px-[calc(50vw-620px)]"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={product.id === selectedId}
            onClick={() => handleSelect(product.id)}
          />
        ))}
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => handleSelect(product.id)}
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
