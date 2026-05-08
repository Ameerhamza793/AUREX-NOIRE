import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { API_BASE } from "@/lib/queryClient";

type CreateOrderInput = z.infer<typeof api.orders.create.input>;

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const url = `${API_BASE}${api.orders.create.path}`;
      let res: Response;
      try {
        res = await fetch(url, {
          method: api.orders.create.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (networkErr) {
        console.error("[Order] Network error:", networkErr);
        throw new Error("Network error — check your connection");
      }

      if (!res.ok) {
        let errBody = "";
        try { errBody = await res.text(); } catch {}
        console.error(`[Order] Server returned ${res.status}:`, errBody);
        throw new Error(`Server error ${res.status}: ${errBody}`);
      }

      try {
        return await res.json();
      } catch (parseErr) {
        console.error("[Order] Failed to parse response:", parseErr);
        throw new Error("Invalid response from server");
      }
    },
  });
}
