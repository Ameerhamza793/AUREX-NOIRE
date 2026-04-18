import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Heart, Watch } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = useWishlist((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Blog" },
    { href: "/contact", label: "About us" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-background/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-2">
              <Watch className="w-6 h-6 text-primary group-hover:rotate-45 transition-transform duration-500" />
              <span className="font-display text-2xl font-bold tracking-[0.2em] text-white uppercase transition-colors group-hover:text-primary">
                AUREX NOIRE
              </span>
            </div>
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="text-[8px] tracking-[0.4em] text-primary/80 uppercase font-medium"
            >
              Feel the Premiumness
            </motion.span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-12">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[10px] tracking-[0.2em] uppercase hover:text-primary transition-colors duration-300 relative group ${
                  location === link.href ? "text-primary" : "text-white/70"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full ${location === link.href ? "w-full" : ""}`} />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <Link href="/wishlist" className="relative text-white/80 hover:text-red-400 transition-colors hidden md:block">
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-red-400 text-red-400" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative text-white/80 hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-background text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button className="bg-white text-black px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-primary transition-colors hidden md:block">
              Login
            </button>
            
            <button
              className="lg:hidden text-white/80"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-white/10"
          >
            <div className="px-4 py-8 space-y-6 flex flex-col items-center">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs tracking-widest uppercase ${
                    location === link.href ? "text-primary" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/80 hover:text-red-400 transition-colors"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-red-400 text-red-400" : ""}`} />
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <button 
                className="w-full bg-white text-black py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
