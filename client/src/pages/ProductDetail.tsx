import { useRoute, useLocation, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Minus, ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const id = params?.id;

  const { data: product, isLoading } = useProduct(id || "");
  const addToCart = useCart((state) => state.addToCart);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-white text-2xl font-display uppercase tracking-widest">
          Product not found
        </h1>
        <Link
          href="/"
          className="bg-primary text-background px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast({
      title: "Added to Bag",
      description: `${quantity}x ${product.name} added.`,
    });
    setLocation("/checkout");
  };

  if (!product) return null;

  // Use product.images if available, otherwise fallback to product.imageUrl
  const rawImages = (product.images && product.images.length > 0) ? product.images : [product.imageUrl];
  // Filter out any null/undefined/empty strings and limit to 10
  const allImages = rawImages.filter(img => typeof img === 'string' && img.trim() !== '').slice(0, 10);
  
  // Final fallback if allImages is still empty
  if (allImages.length === 0) {
    allImages.push("https://via.placeholder.com/600");
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-muted-foreground hover:text-white mb-8 text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Slider */}
          <div 
            className="relative aspect-[1/1] bg-card/50 overflow-hidden group rounded-xl flex items-center justify-center cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => {
                  const added = toggleWishlist(product);
                  toast({
                    title: added ? "Added to Wishlist" : "Removed from Wishlist",
                    description: added
                      ? `${product.name} saved to your wishlist.`
                      : `${product.name} removed from your wishlist.`,
                  });
                }}
                className={`p-3 rounded-full bg-black/40 backdrop-blur-md transition-all duration-200 ${
                  isWishlisted(product.id) ? "text-red-500 scale-110" : "text-white hover:text-red-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative flex items-center justify-center"
              >
                <Zoom>
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${product.name} - ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain p-4 md:p-8 cursor-zoom-in"
                    draggable="false"
                  />
                </Zoom>
              </motion.div>
            </AnimatePresence>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-primary" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-start">
            <div className="space-y-4 pb-8 mb-8 border-b border-white/10">
              {/* Category & Status Badges */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-primary font-bold">Watches</span>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest">In Stock</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-white mb-2 leading-tight font-bold">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-3xl md:text-4xl text-primary font-bold font-serif">Rs.{product.price}</p>
              </div>

              {/* COD Fee */}
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 px-3 py-1.5 rounded-full font-semibold">
                  🚚 Cash on Delivery: <span className="text-white font-bold">165 PKR</span>
                </span>
              </div>

              {/* Customer Stats */}
              <div className="space-y-2 text-xs md:text-sm">
                <p className="text-white/70 uppercase tracking-widest">U.U: U3 1,000,000+ HAPPY CUSTOMERS</p>
                <p className="text-white/50 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  People are viewing this right now
                </p>
              </div>

              {/* Quantity Section */}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-white/70 mb-3 font-bold">QUANTITY</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5 h-12 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 h-full text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-white text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 h-full text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 w-full flex flex-col gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full h-12 bg-[#4e31aa] text-white px-8 uppercase tracking-widest text-[11px] font-bold hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 group rounded-lg shadow-lg"
                  >
                    Add to cart - Rs.{product.price}
                  </button>
                  <a
                    href={`https://wa.me/923032811539?text=${encodeURIComponent(
                      `I would like to order ${quantity}x ${product.name} (Rs.${product.price} each). Total: Rs.${(
                        parseFloat(product.price) * quantity
                      ).toFixed(0)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-[#25D366] text-white px-8 uppercase tracking-widest text-[11px] font-bold hover:bg-[#20ba5a] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 rounded-lg shadow-lg"
                  >
                    <SiWhatsapp className="w-4 h-4" />
                    Order on WhatsApp
                  </a>
                </div>
              </div>

              <p className="mt-6 text-muted-foreground">{product.description}</p>
            </div>

            {/* View Count & Privacy */}
            <div className="flex items-center justify-between text-xs text-white/50 mt-8">
              <span className="flex items-center gap-2">
                <span>0 views</span>
              </span>
              <button className="text-white/50 hover:text-white/70 transition-colors">
                Privacy settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}