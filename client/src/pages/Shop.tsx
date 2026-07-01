import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Loader2, ChevronLeft, ChevronRight, LayoutGrid, Watch, Gem, ShoppingBag, Package, Headset, Headphones, Award, Layers, Sparkles, ShieldCheck, Droplets, Crown, ChevronRight as ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

/* ─── Lifestyle section images ─── */
const LIFESTYLE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop", tall: true },
  { src: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop", tall: false },
  { src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", tall: false },
  { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", tall: true },
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", tall: false },
  { src: "/headphones.jpg", tall: false },
];

/* ─── Feature cards ─── */
const FEATURES = [
  { icon: Award,       title: "Master Craftsmanship",  desc: "Every piece is handcrafted by skilled artisans with decades of experience, ensuring perfection in every detail." },
  { icon: Layers,      title: "Premium Materials",     desc: "We source only the finest materials — 18k gold, sapphire crystal, genuine leather, and exotic metals." },
  { icon: Sparkles,    title: "Timeless Design",       desc: "Our designs transcend trends, blending classic elegance with contemporary luxury for lasting appeal." },
  { icon: ShieldCheck, title: "Quality Guaranteed",    desc: "Every product undergoes rigorous quality control before reaching your hands. Backed by our lifetime warranty." },
  { icon: Droplets,    title: "Water Resistant",       desc: "Engineered to withstand the elements — all timepieces are tested to 100m water resistance standards." },
  { icon: Crown,       title: "Authentic Luxury",      desc: "Genuine certificates of authenticity accompany every purchase, guaranteeing provenance and value." },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { name: "Sophia Laurent", role: "Fashion Editor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", review: "The craftsmanship is unparalleled. My Aurex Noire timepiece is the most complimented piece I own. Truly luxury redefined." },
  { name: "James Whitmore", role: "CEO, Whitmore Group", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", review: "I've owned many luxury watches, but nothing compares to the attention to detail here. Worth every penny and more." },
  { name: "Aisha Patel", role: "Lifestyle Blogger", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop", review: "The jewellery collection is breathtaking. I ordered the pendant necklace and received so many compliments at the gala." },
  { name: "Marcus Chen", role: "Architect", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", review: "Delivered in stunning packaging. The headphones sound as premium as they look. Aurex Noire gets luxury right." },
  { name: "Elena Rossi", role: "Art Director", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", review: "The handbag is a masterpiece of design and function. It draws attention wherever I go. Five stars without hesitation." },
  { name: "David Okafor", role: "Investment Banker", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop", review: "Exceptional quality and even better customer service. My wife loved the jewellery gift — it exceeded every expectation." },
];

function ShopBottomSections() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      {/* ── 1. Lifestyle Grid ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-primary uppercase tracking-widest text-xs mb-3 italic">The Aurex Noire Life</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Experience Luxury <span className="text-primary italic">In Style</span>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            Discover how our collections elevate every moment — from boardrooms to black-tie events, crafted for those who demand the finest.
          </p>
          <div className="w-24 h-[1px] bg-primary mx-auto mt-6" />
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {LIFESTYLE_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-sm group cursor-pointer ${img.tall ? "row-span-2" : ""}`}
              style={{ height: img.tall ? 420 : 200 }}
            >
              <img
                src={img.src}
                alt="Aurex Noire lifestyle"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-500 rounded-sm" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 2. Why Choose Aurex Noire ─────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-primary uppercase tracking-widest text-xs mb-3 italic">Our Promise</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              Why Choose <span className="text-primary">Aurex Noire?</span>
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              We don't just sell luxury — we curate it. Every detail, every material, every piece is chosen to exceed your expectations.
            </p>
            <div className="w-24 h-[1px] bg-primary mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-6 rounded-sm border border-white/8 hover:border-primary/40 bg-white/3 hover:bg-white/5 transition-all duration-400 cursor-default"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-white text-lg font-bold">{f.title}</h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-primary text-xs uppercase tracking-widest font-medium group-hover:gap-2 transition-all duration-300">
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Happy Customers ────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-primary uppercase tracking-widest text-xs mb-3 italic">Real Stories</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              Our Happy <span className="text-primary">Customers</span>
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              For over a decade, we've been committed to delivering exceptional luxury that exceeds every expectation.
            </p>
            <div className="w-24 h-[1px] bg-primary mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-sm border border-white/8 hover:border-primary/30 bg-white/3 hover:bg-white/5 transition-all duration-400"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm font-display">{t.name}</p>
                    <p className="text-primary text-[10px] uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-primary fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">"{t.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Newsletter ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4" style={{ background: "linear-gradient(135deg, #0a0a12 0%, #12080a 100%)" }}>
        {/* Decorative gold glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5 blur-3xl" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-5 blur-3xl" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <p className="text-primary uppercase tracking-widest text-xs mb-3 italic">Stay Connected</p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              Don't Miss Any <span className="text-primary italic">Updates</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Be the first to know about new arrivals, exclusive collections, and members-only offers. Join the Aurex Noire inner circle.
            </p>

            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-primary font-display text-lg"
              >
                ✦ Welcome to the circle. We'll be in touch.
              </motion.p>
            ) : (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/8 border border-white/15 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors rounded-sm"
                />
                <button
                  onClick={() => { if (email.includes("@")) setSubscribed(true); }}
                  className="px-6 py-3 bg-primary text-black text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            )}
          </motion.div>

          {/* Right — watch image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-shrink-0 hidden md:block"
          >
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=600&auto=format&fit=crop"
                alt="Luxury watch"
                className="w-64 h-64 object-cover rounded-full border-2 border-primary/30"
                style={{ boxShadow: "0 0 60px rgba(212,175,55,0.25)" }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

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

      <ShopBottomSections />
      <Footer />
    </div>
  );
}
