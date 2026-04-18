import { z } from 'zod';
import { insertProductSchema, insertOrderSchema, insertContactSchema, insertWishlistItemSchema, products, orders, contactMessages, wishlistItems } from './schema';

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
      },
    },
  },
  wishlist: {
    list: {
      method: 'GET' as const,
      path: '/api/wishlist',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/wishlist',
      input: insertWishlistItemSchema,
      responses: {
        201: z.custom<typeof wishlistItems.$inferSelect>(),
      },
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/wishlist/:productId',
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        ...insertOrderSchema.shape,
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.string().optional(),
          name: z.string().optional(),
          imageUrl: z.string().optional(),
        })),
      }),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contactMessages.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
