"use client";

import { useState, useEffect } from "react";
import CaldeiraLogo from "./CaldeiraLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <a href="#" aria-label="Instituto Caldeira">
          <CaldeiraLogo variant="light" width={56} height={62} />
        </a>

        <a
          href="#produtos"
          className="inline-flex items-center justify-center border-2 border-primary bg-transparent px-5 py-2 font-body text-xs font-medium uppercase tracking-[0.07em] text-primary transition-all duration-300 hover:bg-primary hover:text-black"
        >
          Seja Membro
        </a>
      </div>
    </header>
  );
}
