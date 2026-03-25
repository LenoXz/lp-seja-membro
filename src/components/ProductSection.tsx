"use client";

import { useState, useRef, useEffect } from "react";
import { products } from "@/data/products";
import { useInView } from "@/hooks/useInView";
import { supabase } from "@/lib/supabase";
import ProductCarousel from "./ProductCarousel";
import DynamicForm from "./DynamicForm";

export default function ProductSection() {
  const [selectedId, setSelectedId] = useState("membership");
  const [formVisible, setFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const selectedProduct = products.find((p) => p.id === selectedId) ?? products[0];
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.2 });

  const handleSelect = (id: string) => {
    if (id !== selectedId) {
      setFormVisible(false);
    }
    setSelectedId(id);
  };

  const handleCta = (id: string) => {
    const product = products.find((p) => p.id === id);

    if (product?.externalLink) {
      // Track the click
      supabase
        .from("page_views")
        .insert({ page: `click:${id}`, referrer: window.location.href, user_agent: navigator.userAgent })
        .then();

      window.open(product.externalLink, "_blank", "noopener,noreferrer");
      return;
    }

    setSelectedId(id);
    setFormVisible(true);
  };

  // Scroll to form when it becomes visible
  useEffect(() => {
    if (formVisible && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [formVisible, selectedId]);

  return (
    <section id="produtos" className="relative bg-black py-12 md:py-20">
      {/* Section header */}
      <div ref={headerRef} className="mx-auto mb-6 max-w-[1920px] px-5 md:mb-8 md:px-8">
        <p
          className={`mb-3 font-body text-xs font-bold uppercase tracking-[3.5px] text-primary transition-all duration-600 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Nossos Produtos
        </p>
        <h2
          className={`font-display text-[clamp(1.5rem,5vw,3rem)] font-bold leading-[1.1] text-white transition-all duration-700 delay-150 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Escolha a melhor forma
          <br />
          de se conectar
        </h2>
      </div>

      {/* Carousel */}
      <ProductCarousel
        products={products}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCta={handleCta}
      />

      {/* Form — hidden until CTA is clicked */}
      {formVisible && (
        <>
          <div className="mx-5 my-10 h-px bg-gray-800 md:mx-8 md:my-16" />

          <div ref={formRef} className="mx-auto max-w-2xl px-5 pt-2 md:px-8 animate-fadeUp">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white md:text-xl">
                {selectedProduct.title}
              </h3>
              <button
                onClick={() => setFormVisible(false)}
                className="font-body text-xs font-medium uppercase tracking-wider text-gray-400 transition-colors hover:text-white"
              >
                ✕ Fechar
              </button>
            </div>
            <DynamicForm product={selectedProduct} />
          </div>
        </>
      )}
    </section>
  );
}
