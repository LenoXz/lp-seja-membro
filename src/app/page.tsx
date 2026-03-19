import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CaldeiraCarousel from "@/components/CaldeiraCarousel";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";

export default function Home() {
  return (
    <>
      <PageTracker />
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
