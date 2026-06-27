import { Link } from "wouter";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} is now in your bag.`,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: product.name,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block relative bg-card/20 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5" data-testid={`link-product-${product.id}`}>
      <div className="aspect-[3/4] overflow-hidden relative">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
        </button>

        {/* Overlay Action */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="translate-y-8 group-hover:translate-y-0 transition-all duration-500 bg-white text-black px-6 py-3 font-bold text-[10px] tracking-widest hover:bg-primary flex items-center gap-2 rounded-full"
          >
            <ShoppingBag className="w-4 h-4" /> ADD TO BAG
          </button>
        </div>
      </div>

      <div className="p-4 text-center space-y-2">
        <p className="text-[10px] text-primary/60 uppercase tracking-[0.2em]">{product.category}</p>
        <h3 className="font-display text-base text-white group-hover:text-primary transition-colors duration-300 font-medium truncate">
          {product.name}
        </h3>
        <p className="text-sm font-serif text-white/80">{product.price} PKR</p>
      </div>
    </Link>
  );
}
