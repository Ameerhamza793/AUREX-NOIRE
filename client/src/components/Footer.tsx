import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "#080808" }} className="border-t border-[#2A2A2A]">
      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <h3
              className="text-[#C9A84C] text-xl tracking-[4px] uppercase font-bold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              AUREX NOIRE
            </h3>
            <p className="text-[#888] text-sm leading-relaxed">
              Pakistan's premium destination for luxury watches, jewellery, handbags, and accessories.
            </p>
            <a
              href="https://wa.me/923032811539"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#888] hover:text-[#25D366] transition-colors text-sm"
              data-testid="link-whatsapp-footer"
            >
              <Phone className="w-4 h-4" />
              03032811539
            </a>
            {/* Social */}
            <div className="flex gap-4 pt-1">
              {[
                { icon: Instagram, href: "#", label: "instagram" },
                { icon: Facebook, href: "#", label: "facebook" },
                { icon: Twitter, href: "#", label: "twitter" },
                { icon: Youtube, href: "#", label: "youtube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 border border-[#2A2A2A] flex items-center justify-center text-[#666] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 rounded"
                  data-testid={`link-${label}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#F5F5F0] text-xs tracking-[3px] uppercase font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Shop All", href: "/shop" },
                { label: "New Arrivals", href: "/shop" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Cart", href: "/cart" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[#888] hover:text-[#C9A84C] transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#F5F5F0] text-xs tracking-[3px] uppercase font-semibold mb-5">Categories</h4>
            <ul className="space-y-3">
              {["Watches", "Jewellery", "Hand Bags", "Accessories", "New Arrivals"].map((cat) => (
                <li key={cat}>
                  <Link href="/shop" className="text-[#888] hover:text-[#C9A84C] transition-colors text-sm">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Payment */}
          <div>
            <h4 className="text-[#F5F5F0] text-xs tracking-[3px] uppercase font-semibold mb-5">We Accept</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Visa", "Mastercard", "JazzCash", "EasyPaisa", "COD"].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 border border-[#2A2A2A] text-[#666] text-[10px] tracking-[1px] uppercase rounded"
                >
                  {method}
                </span>
              ))}
            </div>
            <h4 className="text-[#F5F5F0] text-xs tracking-[3px] uppercase font-semibold mb-3">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="/contact" className="text-[#888] hover:text-[#C9A84C] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2A2A2A]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#444] text-xs">
            © {new Date().getFullYear()} Aurex Noire. All rights reserved.
          </p>
          <p className="text-[#333] text-xs">Made in Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
