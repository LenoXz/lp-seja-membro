"use client";

import { useInView } from "@/hooks/useInView";

export default function Hero() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70vh] items-center bg-black px-5 pt-24 pb-12 md:min-h-screen md:px-8 md:pt-32 md:pb-20 overflow-hidden"
    >
      {/* Decorative green bars - animated */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-0 top-[25%] h-[4px] bg-primary transition-all duration-1000 delay-500 ${
            isInView ? "w-[80px] opacity-40" : "w-0 opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-[55%] h-[4px] bg-primary transition-all duration-1000 delay-700 ${
            isInView ? "w-[100px] opacity-30" : "w-0 opacity-0"
          }`}
        />
        <div
          className={`absolute left-[8%] bottom-[20%] h-[4px] bg-primary transition-all duration-1000 delay-900 ${
            isInView ? "w-[60px] opacity-20" : "w-0 opacity-0"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1920px]">
        <p
          className={`mb-4 font-body text-xs font-bold uppercase tracking-[3.5px] text-primary md:text-sm transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Instituto Caldeira
        </p>
        <h1
          className={`font-display text-[clamp(2rem,8vw,5rem)] font-bold leading-[1.05] tracking-[0.03em] text-white transition-all duration-700 delay-150 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Faça parte
          <br />
          do ecossistema
          <br />
          <span className="text-primary">de inovação</span>
        </h1>
        <p
          className={`mt-6 max-w-md font-body text-base leading-relaxed text-gray-200 md:text-lg transition-all duration-700 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Conecte sua empresa ao maior hub de inovação do Sul do Brasil.
        </p>
        <a
          href="#produtos"
          className={`relative mt-8 inline-flex items-center justify-center border-2 border-primary bg-transparent px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.07em] text-primary transition-all duration-300 hover:bg-primary hover:text-black ${
            isInView ? "opacity-100 translate-y-0 delay-500" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: isInView ? "450ms" : "0ms" }}
        >
          Conheça os produtos
        </a>
      </div>
    </section>
  );
}
