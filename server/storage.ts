import { db } from "./db";
import {
  products,
  orders,
  orderItems,
  contactMessages,
  wishlistItems,
  type Product,
  type InsertProduct,
  type InsertOrder,
  type InsertOrderItem,
  type InsertContactMessage,
  type Order,
  type ContactMessage,
  type WishlistItem,
  type InsertWishlistItem,
} from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  createOrder(order: InsertOrder, items: { productId: number; quantity: number; price?: string; name?: string }[]): Promise<Order>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getWishlist(): Promise<Product[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(productId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    const productsList = await db.select().from(products);
    if (productsList.length === 0) {
      await this.createProduct({
        name: "Obsidian Chronograph",
        description: "A masterclass in modern horology. Featuring a matte black stainless steel case, sapphire crystal glass, and a precise Swiss movement. The essence of AUREX NOIRE.",
        price: "599.00",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Watches"
      });
      await this.createProduct({
        name: "Midnight Silk Scarf",
        description: "Handwoven from the finest mulberry silk. A subtle, luxurious accessory that complements any evening attire. Deep, rich black with silver accents.",
        price: "129.00",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Accessories"
      });
      await this.createProduct({
        name: "Noir Leather Weekender",
        description: "Crafted from full-grain Italian leather. This spacious weekender bag blends functionality with uncompromising style. Includes brass hardware and a detachable shoulder strap.",
        price: "450.00",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Bags"
      });
      await this.createProduct({
        name: "Onyx Signet Ring",
        description: "A bold statement piece. Sterling silver set with a genuine flat-cut black onyx stone. Minimalist design, maximum impact.",
        price: "189.00",
        imageUrl: "https://images.unsplash.com/photo-1617038224558-283096c9676a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Jewelry"
      });
      await this.createProduct({
        name: "Eclipse Sunglasses",
        description: "Polarized lenses housed in a sleek acetate frame. Provides 100% UV protection without compromising on the signature AUREX aesthetic.",
        price: "149.00",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Accessories"
      });
      return await db.select().from(products);
    }
    return productsList;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    if (isNaN(id)) return undefined;
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async createOrder(order: InsertOrder, items: { productId: number; quantity: number; price?: string; name?: string }[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    for (const item of items) {
      // Try to find product in local DB first, otherwise use price from cart data
      const product = await this.getProduct(item.productId).catch(() => undefined);
      const priceToUse = product?.price ?? item.price ?? "0";
      
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: priceToUse,
      });
    }
    
    return newOrder;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getWishlist(): Promise<Product[]> {
    const wishlist = await db.select().from(wishlistItems);
    if (wishlist.length === 0) return [];
    const productIds = wishlist.map(i => i.productId);
    return await db.select().from(products).where(inArray(products.id, productIds));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const [newItem] = await db.insert(wishlistItems).values(item).returning();
    return newItem;
  }

  async removeFromWishlist(productId: number): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.productId, productId));
  }
}

export const storage = new DatabaseStorage();
