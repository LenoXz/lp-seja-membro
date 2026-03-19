"use client";

import { useCallback } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCta: (id: string) => void;
}

export default function ProductCarousel({ products, selectedId, onSelect, onCta }: ProductCarouselProps) {
  const currentIndex = products.findIndex((p) => p.id === selectedId);
  const safeIndex = currentIndex >= 0 ? currentIndex : Math.floor(products.length / 2);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(products.length - 1, index));
      onSelect(products[clamped].id);
    },
    [products, onSelect]
  );

  const goPrev = () => goTo(safeIndex - 1);
  const goNext = () => goTo(safeIndex + 1);

  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < products.length - 1;

  return (
    <div className="relative">
      {/* Card display — single card centered */}
      <div className="mx-auto flex items-center justify-center px-5 md:px-8">
        {/* Left arrow */}
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 transition-all duration-300 md:mr-6 ${
            hasPrev
              ? "border-primary text-primary hover:bg-primary hover:text-black cursor-pointer"
              : "border-gray-700 text-gray-700 cursor-not-allowed"
          }`}
          aria-label="Produto anterior"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </button>

        {/* Current card */}
        <div className="w-full max-w-[400px]">
          <ProductCard
            product={products[safeIndex]}
            isSelected={true}
            onClick={() => {}}
            onCta={() => onCta(products[safeIndex].id)}
          />
        </div>

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={!hasNext}
          className={`ml-4 flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 transition-all duration-300 md:ml-6 ${
            hasNext
              ? "border-primary text-primary hover:bg-primary hover:text-black cursor-pointer"
              : "border-gray-700 text-gray-700 cursor-not-allowed"
          }`}
          aria-label="Próximo produto"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </button>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {products.map((product, i) => (
          <button
            key={product.id}
            onClick={() => goTo(i)}
            className={`h-2 transition-all duration-300 ${
              i === safeIndex
                ? "w-8 bg-primary"
                : "w-2 bg-gray-600 hover:bg-gray-400 cursor-pointer"
            }`}
            aria-label={product.title}
          />
        ))}
      </div>
    </div>
  );
}
