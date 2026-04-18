import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Order Confirmed</h1>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          Thank you for choosing Aurex Noire. Your order has been successfully placed and will be shipped shortly. You will receive a confirmation email with tracking details.
        </p>
        
        <Link href="/" className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm hover:bg-primary transition-colors">
          Return Home
        </Link>
      </div>

      <Footer />
    </div>
  );
}
