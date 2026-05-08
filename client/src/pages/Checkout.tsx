import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { API_BASE } from "@/lib/queryClient";

const WHATSAPP_NUMBER = "923032811539";

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

function buildWhatsAppMessage(data: CheckoutForm, items: any[], total: number): string {
  const itemLines = items
    .map((i) => `  • ${i.name} x${i.quantity} — ${i.price} PKR`)
    .join("\n");

  return (
    `🛍️ *NEW ORDER — AUREX NOIRE*\n\n` +
    `👤 *Customer:* ${data.customerName}\n` +
    `📞 *Phone:* ${data.customerPhone}\n` +
    `📧 *Email:* ${data.customerEmail}\n` +
    `📍 *Address:* ${data.customerAddress}, ${data.customerCity}\n` +
    `💳 *Payment:* ${data.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}\n\n` +
    `📦 *Items:*\n${itemLines}\n\n` +
    `💰 *Total: ${total.toFixed(2)} PKR*`
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "COD" },
  });

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);

    // Build WhatsApp message
    const waMessage = buildWhatsAppMessage(data, items, total);

    // Fire-and-forget: try to save order to backend (never blocks or errors)
    if (API_BASE) {
      fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          customerCity: data.customerCity,
          customerPostalCode: "N/A",
          paymentMethod: data.paymentMethod,
          totalAmount: total.toString(),
          items: items.map((item) => ({
            productId: typeof item.id === "string" ? parseInt(item.id) || 0 : item.id,
            quantity: item.quantity,
            price: item.price?.toString() ?? "0",
            name: item.name,
            imageUrl: item.imageUrl ?? "",
          })),
        }),
      }).catch(() => {});
    }

    // Open WhatsApp with order details
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, "_blank");

    // Clear cart and go to confirmation — ALWAYS
    clearCart();
    setIsSubmitting(false);
    setLocation("/order-confirmation");
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
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-4 uppercase tracking-[0.2em] font-bold hover:bg-primary transition-all duration-500 shadow-xl hover:shadow-primary/20 flex justify-center items-center gap-2 rounded-lg"
                >
                  {isSubmitting ? (
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
                <span>Free</span>
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
