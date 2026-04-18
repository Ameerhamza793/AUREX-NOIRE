# Aurex Noire - Luxury E-commerce Platform

## Overview

Aurex Noire is a luxury e-commerce platform for high-end watches and accessories. The application features a React frontend with a dark, premium aesthetic, an Express.js backend API, and PostgreSQL database for data persistence. The platform supports product browsing, shopping cart functionality, wishlists, order placement, and contact form submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - Zustand for shopping cart state (persisted to localStorage)
  - TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom luxury dark theme using CSS variables
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth page transitions and interactions
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Vite middleware for HMR in development, static file serving in production

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - contains all table definitions
- **Supabase Integration**: Direct Supabase client for categories and products (in `client/src/hooks/`)
- **Tables**:
  - `products` - Product catalog (name, description, price, imageUrl, category)
  - `categories` - Category management (id, name, image) - can be managed from Supabase dashboard
  - `orders` - Customer orders with status tracking
  - `orderItems` - Line items for each order
  - `wishlistItems` - User wishlist entries
  - `contactMessages` - Contact form submissions
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)

### API Structure
Routes are defined declaratively in `shared/routes.ts` with:
- HTTP method and path
- Input validation schemas (Zod)
- Response type definitions

Key endpoints:
- `GET/POST /api/products` - Product listing and creation
- `GET/POST/DELETE /api/wishlist` - Wishlist management
- `POST /api/orders` - Order creation
- `POST /api/contact` - Contact form submission

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code
│   ├── schema.ts     # Drizzle schema definitions
│   └── routes.ts     # API route definitions
└── migrations/       # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Supabase**: Direct client for fetching dynamic categories (see `client/src/hooks/use-categories.ts`)
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage (available but not currently implemented)

## Categories Setup (Supabase)

### How It Works
1. **Frontend Hook** (`client/src/hooks/use-categories.ts`) automatically fetches categories from Supabase
2. **Fallback Support**: If `categories` table doesn't exist or fetch fails, uses default hardcoded categories
3. **Home Page** (`client/src/pages/Home.tsx`): Uses the `useCategories()` hook to fetch and display categories in the carousel

### To Add Dynamic Categories to Supabase:
1. Go to your Supabase Dashboard → Table Editor
2. Create a new table named `categories` with columns:
   - `id` (int8, primary key, auto-increment)
   - `name` (text)
   - `image` (text - URL to category image)
3. Add your category data (e.g., Watches, Jewellery, Hand Bags, Accessories)
4. Categories will automatically appear in the carousel on refresh!

### Supabase Credentials
- URL: `https://oplgegstlksgtfpalghf.supabase.co`
- Anon Key: Already configured in `client/src/hooks/use-categories.ts` and `client/src/hooks/use-products.ts`

### UI Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation for forms and API
- **@hookform/resolvers**: Zod integration with React Hook Form

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Intelligent class merging

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development