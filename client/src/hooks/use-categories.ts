import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Category {
  id: number;
  name: string;
  image: string;
  path?: string;
}

// Fallback categories (in case Supabase fails or table doesn't exist)
const FALLBACK_CATEGORIES: Category[] = [
  { 
    id: 1,
    name: 'Watches', 
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop', 
    path: '/shop?category=Watches' 
  },
  { 
    id: 2,
    name: 'Jewellery', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop', 
    path: '/shop?category=Jewellery' 
  },
  { 
    id: 3,
    name: 'Hand Bags', 
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop', 
    path: '/shop?category=Hand%20Bags' 
  },
  { 
    id: 4,
    name: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?q=80&w=400&auto=format&fit=crop', 
    path: '/shop?category=Accessories' 
  }
];

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, image")
          .order("id", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          return FALLBACK_CATEGORIES;
        }

        if (!data || data.length === 0) {
          console.warn("No categories found in database, using fallback");
          return FALLBACK_CATEGORIES;
        }

        // Map database categories to our format with path
        const categories: Category[] = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          image: cat.image,
          path: `/shop?category=${encodeURIComponent(cat.name)}`
        }));

        console.log("✅ Categories fetched from Supabase:", categories);
        return categories;
      } catch (err) {
        console.error("Exception fetching categories:", err);
        return FALLBACK_CATEGORIES;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
