import { Link } from "wouter";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { Product } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const SALE_PERCENTS = [20, 39, 25, 40, 24, 10, 30, 35];

export function ProductCard({ product, index = 0 }: ProductCardProps & { index?: number }) {
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);

  const salePercent = SALE_PERCENTS[index % SALE_PERCENTS.length];
  const originalPrice = Math.round(parseFloat(product.price) / (1 - salePercent / 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({ title: "Added to Cart", description: product.name });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
      style={{ background: "#141414" }}
      data-testid={`link-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* SALE badge */}
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold tracking-[1px] uppercase px-2 py-1 rounded-sm">
          SALE
        </span>

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          data-testid={`button-wishlist-${product.id}`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-primary text-primary" : "text-white"}`} />
        </button>

        {/* Add to Bag — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-black py-2.5 text-[10px] font-bold tracking-[2px] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            data-testid={`button-add-to-bag-${product.id}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        {/* Name */}
        <h3 className="text-[#F5F5F0] text-sm font-medium leading-snug truncate group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(4)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
          ))}
          <Star className="w-3 h-3 text-[#555]" />
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-sm" data-testid={`text-price-${product.id}`}>
            {product.price} PKR
          </span>
          <span className="text-[#666] text-xs line-through">
            {originalPrice} PKR
          </span>
        </div>
      </div>
    </Link>
  );
}
