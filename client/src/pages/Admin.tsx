import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Bell, Package, Clock, Phone, MapPin, CreditCard, ShoppingBag, LogOut, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PASSWORD = "aurex2026";

interface SupabaseOrder {
  id: number;
  order_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  payment_method: string;
  total_amount: string;
  items: string;
  status: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

function parseItems(itemsStr: string) {
  try {
    return JSON.parse(itemsStr) as { name: string; quantity: number; price: string }[];
  } catch {
    return [];
  }
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin-auth") === "true");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState<SupabaseOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SupabaseOrder | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const alertTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-auth", "true");
      setAuthed(true);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin-auth");
    setAuthed(false);
  };

  // Load all existing orders
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as SupabaseOrder[]);
        setLoading(false);
      });
  }, [authed]);

  // Subscribe to real-time new orders
  useEffect(() => {
    if (!authed) return;

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as SupabaseOrder;

          // Add to top of list
          setOrders((prev) => [newOrder, ...prev]);

          // Show alert banner
          setNewOrderAlert(newOrder);
          setUnreadCount((c) => c + 1);

          // Play notification sound (browser beep via AudioContext)
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.6);
          } catch {}

          // Auto-dismiss alert after 8 seconds
          if (alertTimeout.current) clearTimeout(alertTimeout.current);
          alertTimeout.current = setTimeout(() => setNewOrderAlert(null), 8000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (alertTimeout.current) clearTimeout(alertTimeout.current);
    };
  }, [authed]);

  // --- LOGIN SCREEN ---
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-display text-3xl text-white tracking-widest uppercase">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-2">AUREX NOIRE — Order Management</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter admin password"
              className={`w-full bg-transparent border px-4 py-3 text-white focus:outline-none transition-colors ${
                passwordError ? "border-red-500" : "border-white/20 focus:border-primary"
              }`}
            />
            {passwordError && (
              <p className="text-red-400 text-xs text-center">Incorrect password</p>
            )}
            <button
              onClick={login}
              className="w-full bg-primary text-background py-3 uppercase tracking-widest font-bold text-sm hover:bg-white transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <span className="font-display text-white uppercase tracking-widest text-lg">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-white/60" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* New Order Alert Banner */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="bg-primary text-background px-4 py-3 flex items-center justify-between max-w-7xl mx-auto mt-4 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 animate-bounce" />
              <div>
                <span className="font-bold uppercase tracking-widest text-sm">New Order!</span>
                <span className="ml-3 text-sm opacity-80">
                  {newOrderAlert.customer_name} — {newOrderAlert.total_amount} PKR ({newOrderAlert.payment_method})
                </span>
              </div>
            </div>
            <button onClick={() => setNewOrderAlert(null)} className="text-background/70 hover:text-background text-xl font-bold ml-4">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-white/5 rounded-xl p-5">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-white font-display text-3xl">{orders.length}</p>
          </div>
          <div className="bg-card border border-white/5 rounded-xl p-5">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Pending</p>
            <p className="text-primary font-display text-3xl">{orders.filter(o => o.status === "pending").length}</p>
          </div>
          <div className="bg-card border border-white/5 rounded-xl p-5 col-span-2 md:col-span-1">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-white font-display text-3xl">
              {orders.reduce((sum, o) => sum + parseFloat(o.total_amount || "0"), 0).toFixed(0)} PKR
            </p>
          </div>
        </div>

        {/* Orders list */}
        <h2 className="text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" /> All Orders
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No orders yet. They will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                className="bg-card border border-white/5 rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all"
              >
                {/* Order summary row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-medium">{order.customer_name}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                        order.payment_method === "COD"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}>
                        {order.payment_method}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold bg-white/10 text-white/60">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer_phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{order.customer_city}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-primary font-bold text-lg">{parseFloat(order.total_amount).toFixed(0)} PKR</p>
                    <p className="text-muted-foreground text-xs">{parseItems(order.items).length} item(s)</p>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                        {/* Items */}
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Ordered Items</p>
                          <div className="space-y-1">
                            {parseItems(order.items).map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-white/80">{item.name} × {item.quantity}</span>
                                <span className="text-white/60">{parseFloat(item.price).toFixed(0)} PKR</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping */}
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Shipping Address</p>
                          <p className="text-white/80 text-sm">{order.customer_address}, {order.customer_city}</p>
                          <p className="text-white/60 text-sm">{order.customer_email}</p>
                        </div>

                        {/* WhatsApp contact button */}
                        <a
                          href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(order.customer_name)}%2C%20your%20AUREX%20NOIRE%20order%20of%20${order.total_amount}%20PKR%20has%20been%20received!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Contact on WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Setup instructions box */}
        {orders.length === 0 && !loading && (
          <div className="mt-8 border border-primary/20 rounded-xl p-6 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3 className="text-white font-medium">Supabase Setup Required</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-3">Create the following table in your Supabase dashboard to enable order notifications:</p>
            <pre className="bg-background/60 rounded-lg p-4 text-xs text-white/70 overflow-x-auto leading-relaxed">{`CREATE TABLE orders (
  id bigserial PRIMARY KEY,
  order_id integer,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  customer_address text,
  customer_city text,
  payment_method text,
  total_amount text,
  items text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable real-time on this table:
ALTER TABLE orders REPLICA IDENTITY FULL;`}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
