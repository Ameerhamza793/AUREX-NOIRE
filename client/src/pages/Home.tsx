import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Link } from "wouter";
import { Loader2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, type CSSProperties } from "react";

function CategoryCarousel() {
  const [paused, setPaused] = useState(false);
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[180px]">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) return null;

  // 2× duplication — the -50% keyframe moves exactly one full set
  const track = [...categories, ...categories];

  const anim = (dur: number): CSSProperties => ({
    display: "flex",
    width: "max-content",
    animation: `cat-scroll ${dur}s linear infinite`,
    animationPlayState: paused ? "paused" : "running",
  });

  return (
    <div
      className="w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile — 130px circles */}
      <div className="flex md:hidden py-5">
        <div style={anim(12)}>
          {track.map((cat, i) => (
            <div
              key={`m-${i}`}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer"
              style={{ paddingLeft: 16, paddingRight: 16, gap: 10 }}
              onClick={() => { window.location.href = cat.path || "/shop"; }}
            >
              <div style={{
                width: 130, height: 130, borderRadius: "50%",
                border: "2.5px solid #D4AF37",
                boxShadow: "0 0 14px rgba(212,175,55,0.5), 0 0 28px rgba(212,175,55,0.15)",
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
              </div>
              <span style={{ fontSize: 8, letterSpacing: "0.18em", color: "#fff", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop — 210px circles */}
      <div className="hidden md:flex py-6">
        <div style={anim(18)}>
          {track.map((cat, i) => (
            <div
              key={`d-${i}`}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
              style={{ paddingLeft: 28, paddingRight: 28, gap: 14 }}
              onClick={() => { window.location.href = cat.path || "/shop"; }}
            >
              <div
                className="transition-transform duration-500 group-hover:scale-105"
                style={{
                  width: 210, height: 210, borderRadius: "50%",
                  border: "3px solid #D4AF37",
                  boxShadow: "0 0 20px rgba(212,175,55,0.55), 0 0 45px rgba(212,175,55,0.2)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="group-hover:scale-110 transition-transform duration-500"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
                />
              </div>
              <span
                className="group-hover:text-[#D4AF37] transition-colors duration-300"
                style={{ fontSize: 11, letterSpacing: "0.18em", color: "#fff", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Experience Time In Style Section
function ExperienceSection() {
  const images = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579953645585-c37367f694d7?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523287016663-ba42f5b4b853?q=80&w=500&auto=format&fit=crop",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience Time <br />
              <span className="text-[#D4AF37]">In Style</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Learn how to purchase, maintain, and make the most of your watches with our comprehensive guide. From choosing the perfect timepiece to keeping it in top condition, we've got you covered.
            </p>
            <button className="border-2 border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 text-sm font-semibold tracking-wide">
              Show more
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`overflow-hidden rounded-lg ${
                  idx === 0 ? "col-span-2 row-span-2" : ""
                } ${idx === 1 ? "col-span-1 row-span-1" : ""} ${
                  idx === 2 ? "col-span-1 row-span-1" : ""
                }`}
              >
                <img
                  src={img}
                  alt={`Experience ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                  style={{
                    minHeight: idx === 0 ? "300px" : "140px",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-white/60 text-sm">
          Learn how to purchase, maintain, and make the most of your watches with our comprehensive guide.
        </p>
      </div>
    </section>
  );
}

// Why Our Watch Section
function WhyOurWatchSection() {
  const features = [
    {
      title: "Movement",
      description: "The most important factor for a watch. Movement includes quartz and cost.",
    },
    {
      title: "Case Material",
      description: "Watches can have cases made from a variety of materials, including stainless steel, titanium, copper, nickel, and alloy.",
    },
    {
      title: "Features",
      description: "Modern watches often display the date, day, moon, and also some extra features.",
    },
    {
      title: "Quality",
      description: "A watch will have a smooth and distinct movement, high-quality dial and glass, and a quality finish.",
    },
    {
      title: "Water Resistance",
      description: "A watch with 30-meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
    {
      title: "Face Material",
      description: "The most important factor for a watch. Movement determines its functions and cost.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Our <span className="text-[#D4AF37]">Watch!</span>
          </h2>
          <p className="text-white/60 text-lg">
            Our watches are meticulously crafted using the finest materials, resulting in timepieces of unparalleled quality and style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">{feature.description}</p>
              <div className="flex items-center text-[#D4AF37] cursor-pointer hover:translate-x-1 transition-transform">
                <span className="text-sm font-semibold">Read more</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Happy Customers Section
function HappyCustomersSection() {
  const customers = [
    {
      name: "Rishi Spudi",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rishi",
      review: "A watch with a 30 meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
    {
      name: "Joe Biden",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joe",
      review: "A watch with a 30 meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
    {
      name: "Donald Trump",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Donald",
      review: "A watch with a 30 meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
    {
      name: "Dev Patel",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
      review: "A watch with a 30 meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
    {
      name: "Evan Bisbtic",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Evan",
      review: "A watch with a 30 meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
    {
      name: "Barak Obama",
      role: "Customer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Barak",
      review: "A watch with a 30 meter water resistance rating should be fine for most activities, but you shouldn't dive with it.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Happy <span className="text-[#D4AF37]">Customers</span>
          </h2>
          <p className="text-white/60 text-lg">
            For over a decade, we have been committed to delivering exceptional products that exceed customer expectations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={customer.image}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-white font-bold">{customer.name}</h3>
                  <p className="text-white/60 text-sm">{customer.role}</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{customer.review}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Don't Miss Any <span className="text-[#D4AF37]">Updates</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Watches can have cases made from a variety of materials, including stainless steel, titanium, copper, nickel, and alloy.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border border-white/30 rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-bold hover:bg-[#E8C547] transition-all duration-300 text-sm tracking-wide"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Apple Watch Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop"
              alt="Featured Watch"
              className="w-full max-w-sm object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative Circle */}
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
    </section>
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
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#000"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="overflow-hidden relative bg-background pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-4 px-4">
            <h2 className="font-display text-xl md:text-2xl text-white uppercase tracking-[0.25em] font-bold">
              Shop By Category
            </h2>
            <div className="w-10 h-[1px] bg-[#D4AF37] mx-auto mt-3 opacity-70" />
          </div>
          <CategoryCarousel />
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="pt-5 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
            {products?.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Experience Time In Style Section */}
      <ExperienceSection />

      {/* Why Our Watch Section */}
      <WhyOurWatchSection />

      {/* Happy Customers Section */}
      <HappyCustomersSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
