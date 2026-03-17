import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CaldeiraCarousel from "@/components/CaldeiraCarousel";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CaldeiraCarousel />
        <ProductSection />
      </main>
      <Footer />
    </>
  );
}
