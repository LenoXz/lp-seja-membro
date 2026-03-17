"use client";

import { useState } from "react";
import { products } from "@/data/products";
import ProductCarousel from "./ProductCarousel";
import DynamicForm from "./DynamicForm";

export default function ProductSection() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const selectedProduct = products.find((p) => p.id === selectedId) ?? products[0];

  return (
    <section id="produtos" className="relative bg-black py-12 md:py-20">
      {/* Section header */}
      <div className="mb-8 px-5 md:mb-12 md:px-8">
        <p className="mb-3 font-body text-xs font-bold uppercase tracking-[3.5px] text-primary">
          Nossos Produtos
        </p>
        <h2 className="font-display text-[clamp(1.5rem,5vw,3rem)] font-bold leading-[1.1] text-white">
          Escolha a melhor forma
          <br />
          de se conectar
        </h2>
      </div>

      {/* Carousel — full bleed, no container padding */}
      <ProductCarousel
        products={products}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Separator */}
      <div className="mx-5 my-10 h-px bg-gray-800 md:mx-8 md:my-16" />

      {/* Dynamic Form */}
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <DynamicForm product={selectedProduct} />
      </div>
    </section>
  );
}
