import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Link } from "wouter";
import { Loader2, Truck, RotateCcw, ShieldCheck, CreditCard, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ── COUNTDOWN HOOK ── */
function useCountdown(targetHours = 47) {
  const [time, setTime] = useState({ d: 2, h: targetHours % 24, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) return { d: 2, h: 23, m: 59, s: 59 };
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0A0A0A] border border-[#2A2A2A] rounded flex items-center justify-center">
        <span className="text-[#C9A84C] text-lg sm:text-xl font-bold font-mono">{pad(value)}</span>
      </div>
      <span className="text-[#666] text-[9px] tracking-[2px] uppercase mt-1">{label}</span>
    </div>
  );
}

/* ── CATEGORY GRID ── */
const CATEGORY_IMAGES = [
  { name: "Watches", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", path: "/shop" },
  { name: "Jewellery", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", path: "/shop" },
  { name: "Hand Bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", path: "/shop" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1590736969596-bde59b55ae50?w=600&q=80", path: "/shop" },
];

const BRANDS = [
  "ROLEX", "OMEGA", "GUCCI", "LOUIS VUITTON", "VERSACE", "PRADA", "CARTIER", "HERMES",
];

const BLOG_POSTS = [
  {
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    tag: "Watch Guide",
    title: "How to Choose the Perfect Luxury Watch",
    excerpt: "From movement types to complications — everything you need to know before investing in a timepiece.",
  },
  {
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    tag: "Style",
    title: "Jewellery Trends That Define 2026",
    excerpt: "Bold pieces, layering, and minimalist gold — the looks setting the tone this year.",
  },
  {
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    tag: "Fashion",
    title: "The Art of Pairing Bags With Your Outfit",
    excerpt: "Master the skill of accessorising — from casual daywear to formal evenings.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ── MAIN COMPONENT ── */
export default function Home() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const countdown = useCountdown(23);
  const flashCountdown = useCountdown(5);
  const [activeTab, setActiveTab] = useState<"new" | "best" | "top">("new");
  const [email, setEmail] = useState("");

  const tabProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] overflow-x-hidden">

      {/* ── 1. ANNOUNCEMENT BAR ── */}
      <div className="bg-[#C9A84C] overflow-hidden h-9 flex items-center relative z-50">
        <div className="marquee-container w-full">
          <div className="marquee-track">
            {[...Array(2)].map((_, rep) => (
              <span key={rep} className="inline-flex items-center gap-8 px-8">
                {[
                  "🔥 Sale is Live! Up to 40% OFF",
                  "⭐ Free Delivery on Orders Over 3000 PKR",
                  "✨ New Arrivals Every Week",
                  "💎 Authentic Luxury Products",
                  "🚚 Fast Delivery Across Pakistan",
                ].map((text, i) => (
                  <span key={i} className="flex items-center gap-8">
                    <span className="text-[#0A0A0A] text-[11px] font-bold tracking-[2px] uppercase whitespace-nowrap">
                      {text}
                    </span>
                    <span className="text-[#0A0A0A]/40 font-light">|</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. NAVBAR ── */}
      <Navbar />

      {/* ── 3. HERO ── */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0A0A0A] pt-16 overflow-hidden">
        {/* BG pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C9A84C 0%, transparent 40%)" }}
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20">
          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            <span className="inline-block text-[#C9A84C] text-[11px] tracking-[4px] uppercase font-medium border border-[#C9A84C]/30 px-4 py-1.5 rounded-full">
              New Collection 2026
            </span>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-[#F5F5F0]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Luxury <span className="text-[#C9A84C] italic">Timepieces</span>
              <br />& Fine Accessories
            </h1>
            <p className="text-[#888] text-base leading-relaxed max-w-md">
              Discover exquisite craftsmanship at AUREX NOIRE. Every piece tells a story of precision, elegance, and timeless beauty.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/shop"
                className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-3.5 text-[11px] font-bold tracking-[3px] uppercase hover:bg-[#E8C97A] transition-colors duration-300 rounded"
                data-testid="button-hero-shop-now"
              >
                Shop Now
              </Link>
              <Link
                href="/shop"
                className="border border-[#C9A84C] text-[#C9A84C] px-8 py-3.5 text-[11px] font-bold tracking-[3px] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 rounded"
                data-testid="button-hero-collections"
              >
                View Collections
              </Link>
            </div>
          </motion.div>

          {/* Right — Product Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-[320px] sm:w-[400px] lg:w-[480px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A84C]/10 to-transparent" />
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900"
                alt="Luxury Watch"
                className="w-full rounded-2xl object-cover shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#141414] border border-[#C9A84C]/30 rounded-xl px-5 py-3 shadow-xl">
                <p className="text-[#C9A84C] text-[9px] tracking-[3px] uppercase mb-0.5">Premium Quality</p>
                <p className="text-[#F5F5F0] text-sm font-semibold">Swiss Movement</p>
              </div>
              {/* Floating badge 2 */}
              <div className="absolute -top-4 -right-4 bg-[#C9A84C] rounded-xl px-4 py-3 shadow-xl">
                <p className="text-[#0A0A0A] text-[9px] tracking-[2px] uppercase font-bold">Up to</p>
                <p className="text-[#0A0A0A] text-xl font-bold">40% OFF</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. TRUST BADGES ── */}
      <section className="border-y border-[#2A2A2A] bg-[#0f0f0f]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over 3000 PKR" },
              { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
              { icon: ShieldCheck, title: "Authentic Products", desc: "100% genuine guarantee" },
              { icon: CreditCard, title: "Secure Payment", desc: "JazzCash, EasyPaisa & COD" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[#2A2A2A] rounded">
                  <Icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-[#F5F5F0] text-sm font-semibold">{title}</p>
                  <p className="text-[#666] text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DEALS OF THE WEEK ── */}
      <section className="section-pad bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase mb-2">Limited Time Offers</p>
              <h2
                className="text-3xl sm:text-4xl text-[#F5F5F0] font-bold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Deals of the Week
              </h2>
              <div className="w-12 h-[2px] bg-[#C9A84C] mt-3" />
            </div>
            {/* Countdown */}
            <div className="flex items-center gap-3">
              <span className="text-[#888] text-xs tracking-[1px]">Ends in:</span>
              <div className="flex items-center gap-2">
                <CountdownBlock label="Days" value={countdown.d} />
                <span className="text-[#C9A84C] font-bold text-lg mb-4">:</span>
                <CountdownBlock label="Hours" value={countdown.h} />
                <span className="text-[#C9A84C] font-bold text-lg mb-4">:</span>
                <CountdownBlock label="Mins" value={countdown.m} />
                <span className="text-[#C9A84C] font-bold text-lg mb-4">:</span>
                <CountdownBlock label="Secs" value={countdown.s} />
              </div>
            </div>
          </div>

          {/* Products */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {products.slice(0, 6).map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge="SALE"
                  salePercent={[20, 30, 25, 40, 15, 35][i % 6]}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#C9A84C] text-[11px] tracking-[3px] uppercase hover:gap-3 transition-all duration-300"
              data-testid="link-view-all-deals"
            >
              View All Deals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. FEATURED CATEGORIES ── */}
      <section className="section-pad bg-[#0f0f0f]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase mb-2">Browse By Type</p>
            <h2
              className="text-3xl sm:text-4xl text-[#F5F5F0] font-bold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Shop by Category
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mt-3 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(categories.length > 0
              ? categories.map((c: any) => ({ name: c.name, img: c.image, path: "/shop" }))
              : CATEGORY_IMAGES
            ).slice(0, 4).map((cat, i) => (
              <Link
                key={i}
                href={cat.path || "/shop"}
                className="category-card relative overflow-hidden rounded-lg aspect-[3/4] block group"
                data-testid={`link-category-${i}`}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3
                    className="text-[#F5F5F0] text-xl font-bold mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {cat.name}
                  </h3>
                  <span className="text-[#C9A84C] text-[11px] tracking-[2px] uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. SHOP BY BRANDS ── */}
      <section className="py-12 bg-[#0A0A0A] border-y border-[#2A2A2A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <p className="text-center text-[#888] text-[10px] tracking-[4px] uppercase mb-8">Top Brands</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="brand-item font-bold tracking-[3px] text-sm uppercase cursor-pointer select-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. NEW ARRIVALS (Tabbed) ── */}
      <section className="section-pad bg-[#0f0f0f]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Tabs header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase mb-2">Our Collection</p>
              <h2
                className="text-3xl sm:text-4xl text-[#F5F5F0] font-bold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Featured Products
              </h2>
            </div>
            <div className="flex gap-6 border-b border-[#2A2A2A]">
              {[
                { key: "new", label: "New Arrivals" },
                { key: "best", label: "Best Sellers" },
                { key: "top", label: "Top Rated" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`tab-btn pb-3 text-[11px] tracking-[2px] uppercase font-medium ${
                    activeTab === key ? "active text-[#C9A84C]" : "text-[#666] hover:text-[#F5F5F0]"
                  }`}
                  data-testid={`tab-${key}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {tabProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={activeTab === "best" ? "HOT" : activeTab === "top" ? null : "NEW"}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block border border-[#C9A84C] text-[#C9A84C] px-10 py-3 text-[11px] tracking-[3px] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 rounded"
              data-testid="link-view-all-products"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. FLASH SALE BANNER ── */}
      <section className="py-14 bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div
            className="rounded-xl border border-[#C9A84C]/30 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{ background: "linear-gradient(135deg, #141414 0%, #1a1500 100%)" }}
          >
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Zap className="w-5 h-5 text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase font-bold">Flash Sale</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl text-[#F5F5F0] font-bold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Up to 50% Off Today Only
              </h2>
              <p className="text-[#888] text-sm">Shop premium items at unbeatable prices. Limited stock!</p>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="text-[#888] text-xs">Ends in:</span>
                <div className="flex items-center gap-1.5">
                  <CountdownBlock label="H" value={flashCountdown.h} />
                  <span className="text-[#C9A84C] font-bold mb-4">:</span>
                  <CountdownBlock label="M" value={flashCountdown.m} />
                  <span className="text-[#C9A84C] font-bold mb-4">:</span>
                  <CountdownBlock label="S" value={flashCountdown.s} />
                </div>
              </div>
              <Link
                href="/shop"
                className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-3 text-[11px] font-bold tracking-[3px] uppercase hover:bg-[#E8C97A] transition-colors duration-300 rounded whitespace-nowrap"
                data-testid="button-flash-sale"
              >
                Shop Flash Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. PROMOTIONAL BANNER ── */}
      <section className="section-pad bg-[#0f0f0f]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* App Download */}
            <div className="rounded-xl border border-[#2A2A2A] p-8 flex flex-col justify-center gap-4" style={{ background: "#141414" }}>
              <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase">Coming Soon</p>
              <h3
                className="text-2xl sm:text-3xl text-[#F5F5F0] font-bold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Download Our App
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Shop anywhere, track your orders, and get exclusive app-only deals.
              </p>
              <div className="flex gap-3 flex-wrap">
                {["App Store", "Google Play"].map((store) => (
                  <button
                    key={store}
                    className="border border-[#2A2A2A] hover:border-[#C9A84C] text-[#F5F5F0] hover:text-[#C9A84C] px-5 py-2.5 rounded text-[11px] tracking-[2px] uppercase transition-all duration-300"
                  >
                    {store}
                  </button>
                ))}
              </div>
            </div>

            {/* First Order Discount */}
            <div
              className="rounded-xl p-8 flex flex-col justify-center gap-4"
              style={{ background: "linear-gradient(135deg, #1a1400 0%, #2a2000 100%)", border: "1px solid #C9A84C30" }}
            >
              <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase">Exclusive Offer</p>
              <h3
                className="text-2xl sm:text-3xl text-[#F5F5F0] font-bold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Get 25% Off Your First Order
              </h3>
              <p className="text-[#888] text-sm">Subscribe to our newsletter and unlock your welcome discount.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F5F0] placeholder-[#555] px-4 py-2.5 rounded text-sm outline-none focus:border-[#C9A84C] transition-colors"
                  data-testid="input-promo-email"
                />
                <button
                  className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 font-bold text-[11px] tracking-[2px] uppercase hover:bg-[#E8C97A] transition-colors rounded flex-shrink-0"
                  data-testid="button-subscribe-promo"
                >
                  Get 25% Off
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. BLOG / STYLE GUIDES ── */}
      <section className="section-pad bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase mb-2">Tips & Trends</p>
            <h2
              className="text-3xl sm:text-4xl text-[#F5F5F0] font-bold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Style & Updates
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A84C] mt-3 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
                className="rounded-lg overflow-hidden border border-[#2A2A2A] group cursor-pointer"
                style={{ background: "#141414" }}
                data-testid={`card-blog-${i}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <span className="text-[#C9A84C] text-[10px] tracking-[3px] uppercase font-medium">{post.tag}</span>
                  <h3
                    className="text-[#F5F5F0] text-lg font-bold leading-snug group-hover:text-[#C9A84C] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">{post.excerpt}</p>
                  <button className="text-[#C9A84C] text-[11px] tracking-[2px] uppercase flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. NEWSLETTER ── */}
      <section
        className="py-16 sm:py-20"
        style={{ background: "linear-gradient(135deg, #0f0f00 0%, #141400 50%, #0f0f00 100%)", borderTop: "1px solid #2A2A2A", borderBottom: "1px solid #2A2A2A" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9A84C] text-[11px] tracking-[3px] uppercase mb-3">Join Our Community</p>
          <h2
            className="text-3xl sm:text-5xl text-[#F5F5F0] font-bold mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Subscribe & Get 25% OFF
          </h2>
          <p className="text-[#888] text-sm mb-8">Join 10,000+ luxury shoppers. Exclusive deals, early access, new arrivals.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F5F0] placeholder-[#555] px-5 py-3.5 rounded text-sm outline-none focus:border-[#C9A84C] transition-colors"
              data-testid="input-newsletter-email"
            />
            <button
              className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-3.5 font-bold text-[11px] tracking-[3px] uppercase hover:bg-[#E8C97A] transition-colors duration-300 rounded flex-shrink-0"
              data-testid="button-newsletter-subscribe"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ── 13. FOOTER ── */}
      <Footer />
    </div>
  );
}
