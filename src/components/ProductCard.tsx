import Image from "next/image";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
  onCta: () => void;
}

export default function ProductCard({ product, isSelected, onClick, onCta }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex h-full w-[85vw] flex-shrink-0 snap-center flex-col justify-between text-left transition-all duration-500 cursor-pointer md:w-[60vw] lg:w-[400px] overflow-hidden ${
        isSelected
          ? "border-2 border-primary bg-gray-900 scale-[1.02]"
          : "border-2 border-gray-700 bg-black hover:border-gray-400 hover:scale-[1.01]"
      }`}
    >
      <div>
        {/* Product image */}
        <div className="relative w-full h-48 md:h-56 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover transition-transform duration-700 ${
              isSelected ? "scale-105" : "group-hover:scale-105"
            }`}
            sizes="(max-width: 768px) 85vw, 400px"
            unoptimized
          />
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-500 ${
              isSelected ? "opacity-20" : "opacity-40 group-hover:opacity-20"
            }`}
          />
        </div>

        <div className="p-6 md:p-8">
          {/* Accent bar */}
          <span
            className={`mb-5 block h-1 transition-all duration-500 ${
              isSelected ? "w-14 bg-primary" : "w-8 bg-gray-500 group-hover:w-10 group-hover:bg-gray-300"
            }`}
          />

          {/* Title */}
          <h3
            className={`font-display text-xl font-bold md:text-2xl transition-colors duration-300 ${
              isSelected ? "text-primary" : "text-white"
            }`}
          >
            {product.title}
          </h3>

          {/* Subtitle */}
          <p className="mt-1.5 font-body text-xs font-medium uppercase tracking-[0.15em] text-gray-300">
            {product.subtitle}
          </p>

          {/* Description */}
          <p className="mt-5 font-body text-sm leading-relaxed text-gray-200 md:text-base">
            {product.description}
          </p>

          {/* Highlights */}
          <ul className="mt-5 flex flex-col gap-2.5">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 font-body text-sm text-gray-300">
                <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mx-6 mb-6 pt-4 border-t border-gray-800 md:mx-8 md:mb-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCta();
          }}
          className="w-full inline-flex items-center justify-center border-2 border-primary bg-transparent px-6 py-3 font-body text-sm font-medium uppercase tracking-[0.07em] text-primary transition-all duration-300 hover:bg-primary hover:text-black active:bg-primary active:text-black"
        >
          Quero me conectar
        </button>
      </div>
    </div>
  );
}
