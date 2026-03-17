import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}

export default function ProductCard({ product, isSelected, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-[85vw] max-w-[400px] flex-shrink-0 snap-center flex-col justify-between p-6 text-left transition-all duration-300 md:w-[60vw] md:p-8 lg:w-[400px] ${
        isSelected
          ? "border-2 border-primary bg-gray-900"
          : "border-2 border-gray-700 bg-black hover:border-gray-400"
      }`}
    >
      <div>
        {/* Accent bar */}
        <span
          className={`mb-5 block h-1 transition-all duration-300 ${
            isSelected ? "w-14 bg-primary" : "w-8 bg-gray-500"
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

      {/* Selection indicator */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <span
          className={`inline-block font-body text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
            isSelected ? "text-primary" : "text-gray-500"
          }`}
        >
          {isSelected ? "● Selecionado" : "Toque para selecionar →"}
        </span>
      </div>
    </button>
  );
}
