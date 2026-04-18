import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Loader2, ChevronLeft, ChevronRight, LayoutGrid, Watch, Gem, ShoppingBag, Package, Headset, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const CATEGORY_ICONS: Record<string, any> = {
  "All": LayoutGrid,
  "Watches": Watch,
  "Jewellery": Gem,
  "Bags": ShoppingBag,
  "Hand Bags": ShoppingBag,
  "Accessories": Package,
  "Headphones": Headphones,
  "Earbuds": Headset,
};

export default function Shop() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: dbCategories = [], isLoading: categoriesLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  // Read category from URL query param
  const getUrlCategory = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "All";
  };

  const [activeCategory, setActiveCategory] = useState(getUrlCategory);

  // Sync active category when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setActiveCategory(getUrlCategory());
  }, [location]);

  // Build category list: "All" + categories from Supabase
  const categories = [
    { id: 0, name: "All", image: "" },
    ...dbCategories,
  ];

  const filteredProducts = activeCategory === "All"
    ? products
    : products?.filter(p => {
        const cat = p.category?.trim().toLowerCase();
        const active = activeCategory.trim().toLowerCase();
        return cat === active;
      });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (name: string) => {
    setActiveCategory(name);
    // Update URL without page reload
    const url = name === "All" ? "/shop" : `/shop?category=${encodeURIComponent(name)}`;
    window.history.replaceState({}, "", url);
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-8 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-white mb-4"
        >
          The Collection
        </motion.h1>
        {activeCategory !== "All" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary text-sm uppercase tracking-widest"
          >
            {activeCategory}
          </motion.p>
        )}
      </div>

      {/* Category Filter */}
      <div className="relative max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div ref={scrollRef} className="flex-1 overflow-x-auto no-scrollbar py-4">
            <div className="flex gap-6 px-4 min-w-max">
              {categories.map((cat, index) => {
                const Icon = CATEGORY_ICONS[cat.name] || Package;
                const isActive = activeCategory === cat.name;

                return (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.5 }}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden
                      ${isActive
                        ? "ring-2 ring-primary scale-110 shadow-lg shadow-primary/20"
                        : "bg-white/5 group-hover:bg-white/10 group-hover:scale-105"
                      }
                    `}>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-white/40 group-hover:text-white"}`} />
                      )}
                    </div>
                    <span className={`
                      text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-300
                      ${isActive ? "text-primary" : "text-white/40 group-hover:text-white"}
                    `}>
                      {cat.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts?.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProducts?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/40 text-lg mb-4">No products found in "{activeCategory}"</p>
            <button
              onClick={() => handleCategoryClick("All")}
              className="text-primary text-sm uppercase tracking-widest hover:underline"
            >
              View all products
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
