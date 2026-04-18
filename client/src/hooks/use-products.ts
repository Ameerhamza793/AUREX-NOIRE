import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Types derived from API definition
export type Product = z.infer<typeof api.products.list.responses[200]>[number];

export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");
      
      if (error) throw error;
      
      // Map Supabase snake_case to our CamelCase if needed
      // Based on shared/schema.ts: name, description, price, imageUrl, category
      const products = data.map((p: any) => {
        const getImageArray = (imagesField: any, imageField: any) => {
          const processString = (str: string): string[] => {
            let cleaned = str.trim();
            if (cleaned.endsWith(';')) cleaned = cleaned.slice(0, -1);
            try {
              const parsed = JSON.parse(cleaned);
              return Array.isArray(parsed) ? parsed : [cleaned];
            } catch {
              return cleaned.split(',').map(url => url.trim()).filter(url => url !== '');
            }
          };

          let allFound: string[] = [];
          if (imageField && typeof imageField === 'string') {
            allFound = allFound.concat(processString(imageField));
          }
          if (imagesField && typeof imagesField === 'string') {
            allFound = allFound.concat(processString(imagesField));
          } else if (Array.isArray(imagesField)) {
            allFound = allFound.concat(imagesField);
          }

          // Unique URLs only
          return [...new Set(allFound)].filter(url => typeof url === 'string' && url.startsWith('http'));
        };

        const imageList = getImageArray(p.images, p.image);
        
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price ? p.price.toString() : "0",
          imageUrl: imageList[0] || "https://via.placeholder.com/150",
          images: imageList,
          category: p.category || ""
        };
      });

      return api.products.list.responses[200].parse(products);
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;

      const getImageArray = (imagesField: any, imageField: any) => {
        const processString = (str: string): string[] => {
          let cleaned = str.trim();
          if (cleaned.endsWith(';')) cleaned = cleaned.slice(0, -1);
          try {
            const parsed = JSON.parse(cleaned);
            return Array.isArray(parsed) ? parsed : [cleaned];
          } catch {
            return cleaned.split(',').map(url => url.trim()).filter(url => url !== '');
          }
        };

        let allFound: string[] = [];
        if (imageField && typeof imageField === 'string') {
          allFound = allFound.concat(processString(imageField));
        }
        if (imagesField && typeof imagesField === 'string') {
          allFound = allFound.concat(processString(imagesField));
        } else if (Array.isArray(imagesField)) {
          allFound = allFound.concat(imagesField);
        }

        return [...new Set(allFound)].filter(url => typeof url === 'string' && url.startsWith('http'));
      };

      const imageList = getImageArray(data.images, data.image);

      const product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price ? data.price.toString() : "0",
        imageUrl: imageList[0] || "https://via.placeholder.com/600",
        images: imageList,
        category: data.category || ""
      };

      return api.products.get.responses[200].parse(product);
    },
    enabled: !!id,
  });
}
