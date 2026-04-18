import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactForm) => {
      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "We will get back to you shortly.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-8">About Us</h1>
            <div className="space-y-6 text-muted-foreground leading-relaxed mb-12">
              <p>
                Welcome to <span className="text-white font-medium">Aurex Noire</span>, a distinguished division of the <span className="text-primary font-bold">Business Empire</span>.
              </p>
              <p>
                Under the leadership of <span className="text-white font-bold">Business Empire Ameer Hamza</span>, we have redefined the standards of luxury e-commerce. Our mission is to provide an unparalleled shopping experience for high-end timepieces and accessories.
              </p>
              <p>
                For inquiries regarding our collection, custom orders, or press opportunities, please do not hesitate to reach out. Our concierge team is at your disposal.
              </p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-white text-lg font-display mb-2">Hours</h3>
                <p className="text-muted-foreground">
                  24 hours on
                </p>
              </div>
              <div>
                <h3 className="text-white text-lg font-display mb-2">Direct</h3>
                <p className="text-muted-foreground">
                  +92 303 2811539<br />
                  AUREXNOIRE@gmail.com<br />
                  Superintendent@aurexnoire.com
                </p>
                <div className="mt-6">
                  <a 
                    href="https://wa.me/923032811539" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    data-testid="link-whatsapp-contact"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card p-8 md:p-12 border border-white/5">
            <h2 className="text-2xl text-white font-display mb-8">Send a Message</h2>
            <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wide">Name</label>
                <input
                  {...form.register("name")}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wide">Email</label>
                <input
                  {...form.register("email")}
                  type="email"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wide">Message</label>
                <textarea
                  {...form.register("message")}
                  rows={5}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-xs">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white text-black py-4 uppercase tracking-widest font-medium hover:bg-primary transition-colors disabled:opacity-50 flex justify-center"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
