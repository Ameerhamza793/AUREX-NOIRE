import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { API_BASE } from "@/lib/queryClient";

export type Product = z.infer<typeof api.products.list.responses[200]>[number];

function mapSupabaseProduct(p: any): any {
  const processString = (str: string): string[] => {
    let cleaned = str.trim();
    if (cleaned.endsWith(";")) cleaned = cleaned.slice(0, -1);
    try {
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : [cleaned];
    } catch {
      return cleaned.split(",").map((url) => url.trim()).filter((url) => url !== "");
    }
  };

  let allImages: string[] = [];
  if (p.image && typeof p.image === "string") allImages = allImages.concat(processString(p.image));
  if (p.images && typeof p.images === "string") allImages = allImages.concat(processString(p.images));
  else if (Array.isArray(p.images)) allImages = allImages.concat(p.images);

  const imageList = [...new Set(allImages)].filter(
    (url) => typeof url === "string" && url.startsWith("http")
  );

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price ? p.price.toString() : "0",
    imageUrl: imageList[0] || "https://placehold.co/400x400?text=No+Image",
    images: imageList,
    category: p.category || "",
  };
}

export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (!error && data && data.length > 0) {
          const products = data.map(mapSupabaseProduct);
          return api.products.list.responses[200].parse(products);
        }
      } catch (_) {
        // Supabase unreachable — fall through to backend
      }

      // Fallback: fetch from Replit backend API
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return api.products.list.responses[200].parse(data);
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          const product = mapSupabaseProduct(data);
          return api.products.get.responses[200].parse(product);
        }
      } catch (_) {
        // Fall through to backend
      }

      // Fallback: fetch from Replit backend API
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      const product = mapSupabaseProduct(data);
      return api.products.get.responses[200].parse(product);
    },
    enabled: !!id,
  });
}
