import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Search, Menu, X } from "lucide-react";
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
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/shop?cat=watches", label: "Collections" },
    { href: "/contact", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-400 ${
        isScrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A] py-3"
          : "bg-[#0A0A0A] border-b border-[#2A2A2A] py-4"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span
              className="font-display text-xl sm:text-2xl font-bold tracking-[4px] text-[#C9A84C] uppercase hover:text-[#E8C97A] transition-colors duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              AUREX NOIRE
            </span>
          </Link>

          {/* Center Nav Links — desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[11px] tracking-[2px] uppercase font-medium transition-colors duration-300 relative group ${
                  location === link.href
                    ? "text-[#C9A84C]"
                    : "text-[#888] hover:text-[#F5F5F0]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1px] bg-[#C9A84C] transition-all duration-300 ${
                    location === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              className="text-[#888] hover:text-[#F5F5F0] transition-colors hidden sm:block"
              aria-label="Search"
              data-testid="button-search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative text-[#888] hover:text-[#F5F5F0] transition-colors hidden sm:block"
              data-testid="link-wishlist-nav"
            >
              <Heart
                className={`w-5 h-5 ${wishlistCount > 0 ? "fill-[#C9A84C] text-[#C9A84C]" : ""}`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative text-[#888] hover:text-[#F5F5F0] transition-colors"
              data-testid="link-cart-nav"
            >
              <ShoppingBag
                className={`w-5 h-5 ${cartCount > 0 ? "text-[#C9A84C]" : ""}`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden text-[#888] hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#0f0f0f] border-t border-[#2A2A2A]"
          >
            <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col gap-5">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-[11px] tracking-[3px] uppercase font-medium ${
                    location === link.href ? "text-[#C9A84C]" : "text-[#888]"
                  }`}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-6 pt-2 border-t border-[#2A2A2A]">
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-[#888]"
                >
                  <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-[#C9A84C] text-[#C9A84C]" : ""}`} />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
