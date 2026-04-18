import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const addToCart = useCart((s) => s.addToCart);
  const { toast } = useToast();

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast({ title: "Moved to Cart", description: `${product.name} added to your cart.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <Link href="/">
          <a className="inline-flex items-center text-muted-foreground hover:text-white mb-8 text-sm uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </a>
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <Heart className="w-7 h-7 text-red-400 fill-red-400" />
          <h1 className="font-display text-3xl md:text-4xl text-white font-bold">My Wishlist</h1>
          {items.length > 0 && (
            <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-6">
            <Heart className="w-16 h-16 text-white/10" />
            <p className="text-white/40 text-lg">Your wishlist is empty</p>
            <Link href="/">
              <a className="bg-primary text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors">
                Browse Products
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-white/10 rounded-xl overflow-hidden group"
              >
                <Link href={`/product/${product.id}`}>
                  <a className="block relative aspect-square overflow-hidden bg-black/30">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </a>
                </Link>

                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <a className="block text-white font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </a>
                  </Link>
                  <p className="text-primary font-bold text-lg mb-4">Rs.{product.price}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-black py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        removeFromWishlist(product.id);
                        toast({ title: "Removed", description: `${product.name} removed from wishlist.` });
                      }}
                      className="p-2 rounded-lg border border-white/10 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
