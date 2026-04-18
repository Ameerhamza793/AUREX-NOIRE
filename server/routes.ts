import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendOrderNotificationEmail } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.get(api.wishlist.list.path, async (req, res) => {
    const items = await storage.getWishlist();
    res.json(items);
  });

  app.post(api.wishlist.add.path, async (req, res) => {
    try {
      const input = api.wishlist.add.input.parse(req.body);
      const item = await storage.addToWishlist(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.wishlist.remove.path, async (req, res) => {
    const productId = Number(req.params.productId);
    await storage.removeFromWishlist(productId);
    res.json({ success: true });
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.orders.create.path, async (req, res, next) => {
    try {
      const { items, ...orderData } = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(orderData, items);
      res.status(201).json(order);

      // Send email notification (non-blocking — never affects the order response)
      sendOrderNotificationEmail({
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        customerCity: order.customerCity,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        items: items.map((i) => ({
          name: i.name ?? "Product",
          quantity: i.quantity,
          price: i.price ?? "0",
          imageUrl: i.imageUrl ?? "",
        })),
      }).catch((err) => console.error("[Email] Failed to send notification:", err));
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("[Order] Error creating order:", err);
      next(err);
    }
  });

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed data
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    await storage.createProduct({
      name: "Obsidian Chronograph",
      description: "A masterclass in modern horology. Featuring a matte black stainless steel case, sapphire crystal glass, and a precise Swiss movement. The essence of AUREX NOIRE.",
      price: "599.00",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Watches"
    });
    await storage.createProduct({
      name: "Midnight Silk Scarf",
      description: "Handwoven from the finest mulberry silk. A subtle, luxurious accessory that complements any evening attire. Deep, rich black with silver accents.",
      price: "129.00",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Accessories"
    });
    await storage.createProduct({
      name: "Noir Leather Weekender",
      description: "Crafted from full-grain Italian leather. This spacious weekender bag blends functionality with uncompromising style. Includes brass hardware and a detachable shoulder strap.",
      price: "450.00",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Bags"
    });
    await storage.createProduct({
      name: "Onyx Signet Ring",
      description: "A bold statement piece. Sterling silver set with a genuine flat-cut black onyx stone. Minimalist design, maximum impact.",
      price: "189.00",
      imageUrl: "https://images.unsplash.com/photo-1617038224558-283096c9676a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Jewelry"
    });
    await storage.createProduct({
      name: "Eclipse Sunglasses",
      description: "Polarized lenses housed in a sleek acetate frame. Provides 100% UV protection without compromising on the signature AUREX aesthetic.",
      price: "149.00",
      imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Accessories"
    });
  }

  return httpServer;
}
