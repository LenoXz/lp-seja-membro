export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center bg-black px-5 pt-24 pb-12 md:min-h-screen md:px-8 md:pt-32 md:pb-20">
      {/* Decorative green bars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-[25%] h-[4px] w-[80px] bg-primary opacity-40" />
        <div className="absolute right-0 top-[55%] h-[4px] w-[100px] bg-primary opacity-30" />
        <div className="absolute left-[8%] bottom-[20%] h-[4px] w-[60px] bg-primary opacity-20" />
      </div>

      <div className="relative mx-auto w-full max-w-[1920px]">
        <p className="mb-4 font-body text-xs font-bold uppercase tracking-[3.5px] text-primary md:text-sm">
          Instituto Caldeira
        </p>
        <h1 className="font-display text-[clamp(2rem,8vw,5rem)] font-bold leading-[1.05] tracking-[0.03em] text-white">
          Faça parte
          <br />
          do ecossistema
          <br />
          <span className="text-primary">de inovação</span>
        </h1>
        <p className="mt-6 max-w-md font-body text-base leading-relaxed text-gray-200 md:text-lg">
          Conecte sua empresa ao maior hub de inovação do Sul do Brasil.
        </p>
        <a
          href="#produtos"
          className="relative mt-8 inline-flex items-center justify-center border-2 border-primary bg-transparent px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.07em] text-primary transition-all duration-300 hover:bg-primary hover:text-black"
        >
          Conheça os planos
        </a>
      </div>
    </section>
  );
}
