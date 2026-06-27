import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl text-primary tracking-widest">AUREX NOIRE</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Redefining luxury through minimalist design and exceptional craftsmanship.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-white mb-6 tracking-wide">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Watches</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Jewelry</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Accessories</li>
              <li className="hover:text-primary cursor-pointer transition-colors">New Arrivals</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-white mb-6 tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-white mb-6 tracking-wide">Follow Us</h4>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
              <a 
                href="https://wa.me/923032811539" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#25D366] transition-colors text-sm flex items-center gap-2"
                data-testid="link-whatsapp-footer"
              >
                WhatsApp: 03032811539
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aurex Noire. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
