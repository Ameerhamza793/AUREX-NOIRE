import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Schema for the checkout form
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerAddress: z.string().min(5, "Address is required"),
  customerCity: z.string().min(2, "City is required"),
  paymentMethod: z.enum(["COD", "Online"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const onSubmit = (data: CheckoutForm) => {
    createOrder(
      {
        ...data,
        customerPostalCode: "N/A",
        totalAmount: total.toString(),
        items: items.map((item) => ({
          productId: typeof item.id === 'string' ? parseInt(item.id) || 0 : item.id,
          quantity: item.quantity,
          price: item.price?.toString() ?? "0",
          name: item.name,
          imageUrl: item.imageUrl ?? "",
        })),
      },
      {
        onSuccess: async (order) => {
          // Try to save to Supabase for admin panel — never block the order flow
          try {
            await supabase.from("orders").insert([{
              order_id: order?.id ?? null,
              customer_name: data.customerName,
              customer_email: data.customerEmail,
              customer_phone: data.customerPhone,
              customer_address: data.customerAddress,
              customer_city: data.customerCity,
              payment_method: data.paymentMethod,
              total_amount: total.toString(),
              items: JSON.stringify(items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }))),
              status: "pending",
            }]);
          } catch {
            // Supabase table may not exist yet — order still succeeds
          }
          clearCart();
          setLocation("/order-confirmation");
        },
        onError: (error: any) => {
          console.error("[Checkout] Order failed:", error?.message ?? error);
          toast({
            title: "Error",
            description: "Something went wrong processing your order. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <h1 className="font-display text-4xl text-white mb-12 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Form */}
          <div>
            <h2 className="text-xl text-white mb-8 border-b border-white/10 pb-4">Shipping Information</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase tracking-wide">Full Name</label>
                  <input
                    {...form.register("customerName")}
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-destructive text-xs">{form.formState.errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground uppercase tracking-wide">Phone Number</label>
                  <input
                    {...form.register("customerPhone")}
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="+92 300 1234567"
                  />
                  {form.formState.errors.customerPhone && (
                    <p className="text-destructive text-xs">{form.formState.errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wide">Email Address</label>
                <input
                  {...form.register("customerEmail")}
                  type="email"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
                {form.formState.errors.customerEmail && (
                  <p className="text-destructive text-xs">{form.formState.errors.customerEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wide">Shipping Address</label>
                <textarea
                  {...form.register("customerAddress")}
                  rows={3}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Street address, house number"
                />
                {form.formState.errors.customerAddress && (
                  <p className="text-destructive text-xs">{form.formState.errors.customerAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wide">City</label>
                <input
                  {...form.register("customerCity")}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Karachi"
                />
                {form.formState.errors.customerCity && (
                  <p className="text-destructive text-xs">{form.formState.errors.customerCity.message}</p>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm text-muted-foreground uppercase tracking-wide block">Payment Method</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${form.watch("paymentMethod") === "COD" ? "border-primary bg-primary/5" : "border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" value="COD" {...form.register("paymentMethod")} className="accent-primary" />
                      <span className="text-white text-sm">Cash on Delivery</span>
                    </div>
                  </label>
                  <label className={`flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${form.watch("paymentMethod") === "Online" ? "border-primary bg-primary/5" : "border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" value="Online" {...form.register("paymentMethod")} className="accent-primary" />
                      <span className="text-white text-sm">Online Payment</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-white text-black py-4 uppercase tracking-[0.2em] font-bold hover:bg-primary transition-all duration-500 shadow-xl hover:shadow-primary/20 flex justify-center items-center gap-2 rounded-lg"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Place Order ✅"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Preview */}
          <div className="bg-card p-8 border border-white/5 h-fit">
            <h2 className="text-xl text-white mb-6">Your Order</h2>
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover bg-background" />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-display">{item.name}</h4>
                    <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                    <p className="text-white/80 text-sm mt-1">{item.price} PKR</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/10 space-y-2">
               <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} PKR</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span>0.00 PKR</span>
                </div>
                <div className="flex justify-between text-white text-lg font-medium pt-2">
                  <span>Total</span>
                  <span>{total.toFixed(2)} PKR</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
