import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { API_BASE } from "@/lib/queryClient";

type CreateOrderInput = z.infer<typeof api.orders.create.input>;

const WHATSAPP_NUMBER = "923032811539";

function buildWhatsAppMessage(data: CreateOrderInput): string {
  const itemLines = data.items
    .map((i) => `  • ${i.name ?? "Product"} x${i.quantity} — ${i.price} PKR`)
    .join("\n");

  return (
    `🛍️ *NEW ORDER — AUREX NOIRE*\n\n` +
    `👤 *Customer:* ${data.customerName}\n` +
    `📞 *Phone:* ${data.customerPhone}\n` +
    `📧 *Email:* ${data.customerEmail}\n` +
    `📍 *Address:* ${data.customerAddress}, ${data.customerCity}\n` +
    `💳 *Payment:* ${data.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}\n\n` +
    `📦 *Items:*\n${itemLines}\n\n` +
    `💰 *Total: ${data.totalAmount} PKR*`
  );
}

async function tryBackendOrder(data: CreateOrderInput): Promise<any> {
  const url = `${API_BASE}${api.orders.create.path}`;
  const res = await fetch(url, {
    method: api.orders.create.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      // Try the backend API first (works when VITE_API_URL is set)
      if (API_BASE) {
        try {
          const order = await tryBackendOrder(data);
          // Also open WhatsApp as confirmation regardless
          const msg = buildWhatsAppMessage(data);
          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
            "_blank"
          );
          return order;
        } catch (err) {
          console.warn("[Order] Backend failed, using WhatsApp fallback:", err);
        }
      }

      // WhatsApp fallback — always works, no backend needed
      const msg = buildWhatsAppMessage(data);
      const localOrder = {
        id: Date.now(),
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      return localOrder;
    },
  });
}
