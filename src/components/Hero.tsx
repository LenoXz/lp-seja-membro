export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center bg-black px-5 pt-24 pb-20 md:min-h-screen md:px-8 md:pt-32 md:pb-28">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Green accent bars */}
        <div className="absolute left-0 top-[25%] h-[4px] w-[80px] bg-primary opacity-40" />
        <div className="absolute right-0 top-[55%] h-[4px] w-[100px] bg-primary opacity-30" />
        <div className="absolute left-[8%] bottom-[20%] h-[4px] w-[60px] bg-primary opacity-20" />

        {/* Grid pattern - right side */}
        <div className="absolute right-[5%] top-[20%] hidden md:block">
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 bg-primary"
                style={{ opacity: 0.08 + (i % 5) * 0.03 }}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-[15%] top-[45%] hidden md:block">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 bg-primary"
                style={{ opacity: 0.06 + (i % 4) * 0.03 }}
              />
            ))}
          </div>
        </div>

        {/* Corner frame accent - bottom right */}
        <div className="absolute right-[5%] bottom-[15%] hidden md:block">
          <div className="h-16 w-16 border-r border-b border-primary opacity-15" />
        </div>
        <div className="absolute right-[12%] top-[30%] hidden md:block">
          <div className="h-12 w-12 border-l border-t border-primary opacity-10" />
        </div>

        {/* Subtle vertical line */}
        <div className="absolute right-[35%] top-[15%] h-[120px] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block" />
      </div>

      <div className="relative mx-auto w-full max-w-[1920px]">
        <p className="mb-4 font-body text-xs font-bold uppercase tracking-[3.5px] text-primary md:text-sm">
          Instituto Caldeira
        </p>
        <h1 className="font-display text-[clamp(2rem,8vw,5.5rem)] font-normal leading-[1.05] tracking-[0.02em] text-white">
          Faça parte
          <br />
          da comunidade
          <br />
          <span className="text-primary">Caldeira</span>
        </h1>
        <div className="mt-12 md:mt-14">
          <a
            href="#produtos"
            className="inline-flex items-center justify-center border-2 border-primary bg-transparent px-10 py-4 font-body text-sm font-medium uppercase tracking-[0.07em] text-primary transition-all duration-300 hover:bg-primary hover:text-black"
          >
            Conheça os produtos
          </a>
        </div>
      </div>

      {/* Scroll indicator - animated arrows */}
      <a
        href="#produtos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0 opacity-50 transition-opacity duration-300 hover:opacity-100 md:bottom-8"
        aria-label="Rolar para baixo"
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="animate-[scrollArrow_1.5s_ease-in-out_infinite]">
          <path d="M2 2L10 10L18 2" stroke="#00e846" strokeWidth="2" />
        </svg>
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="animate-[scrollArrow_1.5s_ease-in-out_0.2s_infinite] -mt-1">
          <path d="M2 2L10 10L18 2" stroke="#00e846" strokeWidth="2" />
        </svg>
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="animate-[scrollArrow_1.5s_ease-in-out_0.4s_infinite] -mt-1">
          <path d="M2 2L10 10L18 2" stroke="#00e846" strokeWidth="2" />
        </svg>
      </a>
    </section>
  );
}
