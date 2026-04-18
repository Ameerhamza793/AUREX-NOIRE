import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Wishlist from "@/pages/Wishlist";
import { useEffect, useRef } from "react";

function ScrollManager() {
  const [location] = useLocation();
  const isBackForward = useRef(false);

  // Take over from browser so IT doesn't fight our logic
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position on every scroll, keyed by current route
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const save = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sessionStorage.setItem(`scroll:${location}`, String(window.scrollY));
      }, 80);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", save);
    };
  }, [location]);

  // popstate fires BEFORE the location changes — mark it as back/forward
  useEffect(() => {
    const mark = () => { isBackForward.current = true; };
    window.addEventListener("popstate", mark);
    return () => window.removeEventListener("popstate", mark);
  }, []);

  // When the route changes, decide: restore position or go to top
  useEffect(() => {
    if (isBackForward.current) {
      // Back / Forward — restore saved position for this route
      const saved = sessionStorage.getItem(`scroll:${location}`);
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, left: 0, behavior: "instant" });
      });
      isBackForward.current = false;
    } else {
      // Normal forward navigation (link click) — always go to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location]);

  // bfcache: mobile browsers can freeze/restore pages on back — handle that too
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const saved = sessionStorage.getItem(`scroll:${window.location.pathname}`);
        window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, left: 0, behavior: "instant" });
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}

function Router() {
  return (
    <>
      <ScrollManager />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/wishlist" component={Wishlist} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
