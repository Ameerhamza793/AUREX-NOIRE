import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { items, total, removeFromCart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
          <h1 className="font-display text-3xl text-white">Your Bag is Empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm hover:bg-primary transition-colors">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <h1 className="font-display text-4xl text-white mb-12">Shopping Bag ({items.length})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 py-6 border-b border-white/10 last:border-0">
                <div className="w-24 h-32 bg-card flex-shrink-0 overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-lg text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground uppercase">{item.category}</p>
                    </div>
                    <p className="text-lg text-white font-light">{item.price} PKR</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-white hover:text-primary"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-white hover:text-primary"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const added = toggleWishlist(item);
                          toast({
                            title: added ? "Saved to Wishlist" : "Removed from Wishlist",
                            description: added
                              ? `${item.name} has been saved to your wishlist.`
                              : `${item.name} removed from wishlist.`,
                          });
                        }}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          isWishlisted(item.id)
                            ? "text-red-400"
                            : "text-muted-foreground hover:text-red-400"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted(item.id) ? "fill-current" : ""}`} />
                        <span className="hidden sm:inline">
                          {isWishlisted(item.id) ? "Wishlisted" : "Wishlist"}
                        </span>
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-muted-foreground hover:text-destructive underline decoration-1 underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-8 sticky top-32 border border-white/5">
              <h3 className="font-display text-xl text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-white">{total.toFixed(2)} PKR</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-lg text-white font-medium">
                  <span>Total</span>
                  <span className="text-white">{total.toFixed(2)} PKR</span>
                </div>
              </div>
              
              <Link href="/checkout" className="block w-full bg-white text-black text-center py-4 uppercase tracking-widest font-medium hover:bg-primary transition-colors">
                Proceed to Checkout
              </Link>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Secure checkout powered by Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
