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
  const isJumping = useRef(false);
  const [ready, setReady] = useState(false);

  const count = products.length;
  // Tripled: [clone-set] [original-set] [clone-set]
  const tripled = [...products, ...products, ...products];

  const getRealIndex = (i: number) => ((i % count) + count) % count;

  const scrollToIndex = useCallback(
    (tripledIndex: number, smooth = true) => {
      const container = scrollRef.current;
      if (!container) return;
      const cards = container.querySelectorAll<HTMLElement>("[data-card]");
      const card = cards[tripledIndex];
      if (!card) return;

      const scrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: smooth ? "smooth" : "instant" });
    },
    []
  );

  // On mount, scroll to selected card in middle set without animation
  useEffect(() => {
    const selectedRealIndex = products.findIndex((p) => p.id === selectedId);
    const middleIndex = count + (selectedRealIndex >= 0 ? selectedRealIndex : 0);
    requestAnimationFrame(() => {
      scrollToIndex(middleIndex, false);
      setReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect center card + infinite loop reposition
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeout: ReturnType<typeof setTimeout>;
    let scrollEndTimeout: ReturnType<typeof setTimeout>;

    const detectCenterAndReposition = () => {
      if (isJumping.current) return;

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

      const realIndex = getRealIndex(closestIndex);
      onSelect(products[realIndex].id);

      // Jump back to middle set if we drifted into prefix/suffix
      if (closestIndex < count || closestIndex >= count * 2) {
        isJumping.current = true;
        const middleEquivalent = count + realIndex;
        scrollToIndex(middleEquivalent, false);
        // Give iOS enough time to settle after the instant jump
        setTimeout(() => {
          isJumping.current = false;
        }, 50);
      }
    };

    const handleScroll = () => {
      clearTimeout(timeout);
      clearTimeout(scrollEndTimeout);

      // Quick detection for updating selected state
      timeout = setTimeout(() => {
        if (isJumping.current) return;
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
        const realIndex = getRealIndex(closestIndex);
        onSelect(products[realIndex].id);
      }, 60);

      // Delayed reposition — wait for iOS momentum scrolling to fully stop
      scrollEndTimeout = setTimeout(() => {
        detectCenterAndReposition();
      }, 250);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
      clearTimeout(scrollEndTimeout);
    };
  }, [products, count, onSelect, scrollToIndex]);

  const handleDotClick = (id: string) => {
    onSelect(id);
    const realIndex = products.findIndex((p) => p.id === id);
    scrollToIndex(count + realIndex);
  };

  const handleCardClick = (tripledIndex: number) => {
    const realIndex = getRealIndex(tripledIndex);
    onSelect(products[realIndex].id);
    scrollToIndex(tripledIndex);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={`hide-scrollbar flex items-stretch gap-4 overflow-x-auto px-[7.5vw] pb-2 md:gap-6 md:px-[20vw] lg:px-[calc(50vw-200px)] transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
      >
        {tripled.map((product, i) => (
          <div key={`${product.id}-${i}`} data-card className="flex-shrink-0">
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
