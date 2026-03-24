"use client";

import { useInView } from "@/hooks/useInView";
import CaldeiraLogo from "./CaldeiraLogo";

export default function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <footer ref={ref} className="border-t border-gray-800 bg-black px-5 py-10 md:px-8 md:py-16">
      <div
        className={`mx-auto flex max-w-[1920px] flex-col items-center gap-4 text-center transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <CaldeiraLogo variant="light" width={48} height={54} />
        <p className="font-body text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Instituto Caldeira. Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
