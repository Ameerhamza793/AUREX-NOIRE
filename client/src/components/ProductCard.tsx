import { Link } from "wouter";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { Product } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  badge?: "NEW" | "SALE" | "HOT" | null;
  salePercent?: number;
}

export function ProductCard({ product, badge = "NEW", salePercent }: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);

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
    toast({
      title: wishlisted ? "Removed from Wishlist" : "Saved to Wishlist",
      description: product.name,
    });
  };

  const originalPrice = salePercent
    ? Math.round(parseFloat(product.price) / (1 - salePercent / 100))
    : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block relative rounded-lg overflow-hidden product-card-hover"
      style={{ background: "#141414" }}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-2 left-2 text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 rounded ${
              badge === "SALE"
                ? "bg-red-600 text-white"
                : badge === "HOT"
                ? "bg-orange-500 text-white"
                : "bg-[#C9A84C] text-[#0A0A0A]"
            }`}
            data-testid={`badge-${badge.toLowerCase()}-${product.id}`}
          >
            {badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black"
          data-testid={`button-wishlist-${product.id}`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              wishlisted ? "fill-[#C9A84C] text-[#C9A84C]" : "text-white"
            }`}
          />
        </button>

        {/* Add to Bag hover overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#C9A84C] text-[#0A0A0A] py-2.5 text-[10px] font-bold tracking-[2px] uppercase flex items-center justify-center gap-2 hover:bg-[#E8C97A] transition-colors duration-200"
            data-testid={`button-add-to-bag-${product.id}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-[#666] uppercase tracking-[2px] mb-1">{product.category}</p>
        <h3 className="text-[#F5F5F0] text-sm font-medium leading-snug truncate group-hover:text-[#C9A84C] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5 my-1.5">
          {[...Array(4)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#C9A84C] text-[#C9A84C]" />
          ))}
          <Star className="w-3 h-3 text-[#444]" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-semibold text-sm" data-testid={`text-price-${product.id}`}>
            {product.price} PKR
          </span>
          {originalPrice && (
            <span className="text-[#555] text-xs line-through">
              {originalPrice} PKR
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
