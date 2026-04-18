import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function CategoryCarousel() {
  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { data: categories = [], isLoading } = useCategories();

  // Create infinite loop by duplicating categories
  const extendedCategories = [...categories, ...categories];
  const itemWidthMobile = 170; // 150px circle + gap
  const itemWidthDesktop = 280; // 240px circle + gap

  useEffect(() => {
    if (isHovered || categories.length === 0) return;

    const timer = setInterval(() => {
      setTranslateX((prev) => {
        const nextValue = prev - itemWidthDesktop;
        const maxScroll = categories.length * itemWidthDesktop;
        return nextValue <= -maxScroll ? 0 : nextValue;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [isHovered, categories.length]);

  const CategoryItem = ({ category, size = "desktop" }: { category: any; size?: "mobile" | "desktop" }) => {
    const isMobile = size === "mobile";
    const circleSize = isMobile ? "w-[150px] h-[150px]" : "w-[240px] h-[240px]";
    const textSize = isMobile ? "text-[9px]" : "text-[11px] md:text-[12px]";
    const gapSize = isMobile ? "gap-2" : "gap-3";
    const borderWidth = isMobile ? "p-[0.5px]" : "p-[0.5px]";
    const shadowSize = isMobile ? "shadow-[0_0_6px_rgba(212,175,55,0.05)]" : "shadow-[0_0_8px_rgba(212,175,55,0.08)]";

    return (
      <div
        className={`flex flex-col items-center ${gapSize} cursor-pointer flex-shrink-0`}
        onClick={() => window.location.href = category.path}
      >
        <div className={`${circleSize} flex-shrink-0`}>
          <div className={`relative w-full h-full aspect-square rounded-full ${borderWidth} bg-gradient-to-tr from-[#D4AF37] via-transparent to-[#D4AF37] ${shadowSize}`}>
            <div className="w-full h-full aspect-square rounded-full overflow-hidden border border-[#D4AF37]/5">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover aspect-square" 
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>
        <h3 className={`text-white uppercase tracking-[0.15em] ${textSize} font-display font-bold whitespace-nowrap`}>
          {category.name}
        </h3>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[220px] md:h-[280px]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-[220px] md:h-[280px] text-muted-foreground">
        No categories available
      </div>
    );
  }

  return (
    <>
      {/* Mobile Carousel */}
      <div 
        className="flex md:hidden w-full overflow-hidden justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex gap-4 transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(${translateX * 0.85}px)` }}
        >
          {extendedCategories.map((category, i) => (
            <div key={`mobile-${i}`} className="flex-shrink-0">
              <CategoryItem category={category} size="mobile" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Carousel */}
      <div 
        className="hidden md:flex w-full overflow-hidden justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex gap-12 transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {extendedCategories.map((category, i) => (
            <div key={`desktop-${i}`} className="flex-shrink-0">
              <CategoryItem category={category} size="desktop" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-background text-white font-body">
      {/* Announcement Bar */}
      <div className="bg-black py-2 overflow-hidden border-b border-white/5 relative z-50">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap items-center gap-12"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white">Sale is Live!</span>
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-black font-bold">%</div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white">Luxury Deals</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          ))}
        </motion.div>
      </div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#241f4a]">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#241f4a] via-[#4e31aa]/20 to-[#1a1a2e]" />
        
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary tracking-[0.5em] uppercase text-xs md:text-sm mb-6 animate-pulse"
          >
            New Arrivals
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-8xl text-white font-bold mb-8 leading-tight tracking-tight"
          >
            AUREX NOIRE <br />
            <span className="text-primary italic font-serif font-light">Luxury collections</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-sm md:text-lg mb-10 max-w-2xl mx-auto tracking-wide"
          >
            Discover a world of exquisite timepieces at our online wristwatch shop, where elegance and convenience meet.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link 
              href="/shop"
              className="bg-white text-black px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-primary transition-all duration-500 font-bold rounded-full shadow-lg hover:shadow-primary/20"
            >
              Shop Now ↗
            </Link>
          </motion.div>
        </div>

        {/* Floating Product Image */}
        <div className="absolute right-0 bottom-20 lg:right-10 lg:bottom-20 z-10 w-64 md:w-96 lg:w-[500px] pointer-events-none select-none opacity-40 lg:opacity-100">
          <motion.img 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" 
            alt="Hero Watch" 
            className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Wave Divider */}
        <div className="hero-wave-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 bg-black overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-xl md:text-2xl text-white uppercase tracking-[0.2em] font-bold">Categories</h2>
            <div className="w-12 h-[0.5px] bg-primary mx-auto mt-3" />
          </div>

          <div className="relative h-[220px] md:h-[240px] flex items-center justify-center">
            <CategoryCarousel />
          </div>
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-widest text-xs mb-2 italic">The most popular products</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">New Arrivals</h2>
          <div className="w-24 h-[1px] bg-primary mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
