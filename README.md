# Fullstack SaaS Boilerplate

Full-stack boilerplate featuring React, tRPC, Fastify, Prisma, and PostgreSQL (Neon).

##  Tech-stack
  
-  **React 18** with Vite  
-  **tRPC**  
-  **Fastify** - Node framework  
-  **Prisma** - ORM  
-  **PostgreSQL** (Neon) - Serverless Postgres  
-  **Tailwind CSS** + **shadcn/ui**   
-  **React Query** - Data fetching  
-  **Zod** - Validation  

## Prerequisites

- Node.js 18+  
- pnpm, npm, or yarn 
- A Neon database account  

## Quick Start

### Option 1: Automated Setup (Recommended)

Use setup scripts that automatically install dependencies and create environment files.

**For Linux/macOS:**

```bash
git clone https://github.com/nuhman/saas-boilerplate.git
cd saas-boilerplate
chmod +x setup.sh
./setup.sh
```

**For Windows (PowerShell):**

```powershell
git clone https://github.com/nuhman/saas-boilerplate.git
cd saas-boilerplate
.\setup.ps1
```

After running the setup script:

1. **Edit `server/.env`** and add your Neon database URL:

```env
DATABASE_URL="postgresql://username:password@your-neon-db.neon.tech/dbname?sslmode=require"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

2. **Set up the database:**

```bash
cd server
pnpm run db:push      # Push schema to database
pnpm run db:generate  # Generate Prisma Client
```

3. **Start the development servers** (see step 5 below)

### Option 2: Manual Setup

### 1. Clone the repository

```bash
git clone https://github.com/nuhman/saas-boilerplate.git
cd saas-boilerplate
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 3. Set up environment variables

**Server:**

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your Neon database URL:

```env
DATABASE_URL="postgresql://username:password@your-neon-db.neon.tech/dbname?sslmode=require"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

**Client:**

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
cd server
pnpm run db:push    # Push schema to database
pnpm run db:generate # Generate Prisma Client
```

### 5. Start development servers

Open two terminal windows:

**Terminal 1 - Server:**

```bash
cd server
pnpm run dev
```

**Terminal 2 - Client:**

```bash
cd client
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173) 

## 📁 Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── lib/           # Utilities
│   │   │   ├── trpc.ts    # tRPC React hooks
│   │   │   └── trpcClient.ts
│   │   ├── pages/         # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
└── server/                # Fastify backend
    ├── prisma/
    │   └── schema.prisma  # Database schema
    ├── src/
    │   ├── routers/       # tRPC routers
    │   ├── schemas/       # Zod validation schemas
    │   ├── context.ts     # tRPC context
    │   ├── router.ts      # Main router
    │   ├── trpc.ts        # tRPC setup
    │   └── index.ts       # Server entry
    ├── .env.example
    └── package.json
```

##  What's Included

### Example CRUD Implementation

The boilerplate includes a complete **Movie Watchlist** example demonstrating:

- Create, Read, Update, Delete operations
- Aggregations and statistics
- Filtering and sorting
- Real-time UI updates
- UI with Tailwind + shadcn/ui

### Key Files to Know

**Backend:**

- `server/src/router.ts` - Main tRPC router
- `server/src/routers/movie.router.ts` - Example CRUD router
- `server/src/schemas/movie.schema.ts` - Zod validation schemas
- `server/prisma/schema.prisma` - Database schema

**Frontend:**

- `client/src/lib/trpc.ts` - tRPC React hooks
- `client/src/pages/movies/components/WatchList.tsx` - Example component

## Common Commands

### Server Commands

```bash
cd server

# Development
pnpm run dev          # Start dev server with hot reload

# Database
pnpm run db:push      # Push schema changes to database
pnpm run db:generate  # Generate Prisma Client
pnpm run db:studio    # Open Prisma Studio (DB GUI)

# Production
pnpm run build        # Build for production
pnpm start            # Start production server
```

### Client Commands

```bash
cd client

# Development
pnpm run dev          # Start Vite dev server

# Production
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Code Quality
pnpm run lint         # Run ESLint
```

## Building Your Own Features

### 1. Create a New Database Model

Edit `server/prisma/schema.prisma`:

```prisma
model YourModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Push to database:

```bash
cd server
pnpm run db:push
pnpm run db:generate
```

### 2. Create Validation Schemas

Create `server/src/schemas/yourmodel.schema.ts`:

```typescript
import { z } from "zod";

export const createYourModelSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateYourModelSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
});

export const yourModelIdSchema = z.object({
  id: z.string(),
});
```

### 3. Create a tRPC Router

Create `server/src/routers/yourmodel.router.ts`:

```typescript
import { router, publicProcedure } from "../trpc";
import {
  createYourModelSchema,
  yourModelIdSchema,
} from "../schemas/yourmodel.schema";

export const yourModelRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.yourModel.findMany();
  }),

  create: publicProcedure
    .input(createYourModelSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.yourModel.create({
        data: input,
      });
    }),

  // Add more procedures...
});
```

### 4. Add to Main Router

Update `server/src/router.ts`:

```typescript
import { yourModelRouter } from "./routers/yourmodel.router";

export const appRouter = router({
  // ... existing routers
  yourModel: yourModelRouter,
});
```

### 5. Use in Frontend

```typescript
import { trpc } from "@/lib/trpc";

function YourComponent() {
  const itemsQuery = trpc.yourModel.getAll.useQuery();
  const createMutation = trpc.yourModel.create.useMutation();

  // Use the data!
  return (
    <div>
      {itemsQuery.data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Removing the Example

To remove the Movie Watchlist example:

1. **Database:** Remove `Movie` model from `server/prisma/schema.prisma`
2. **Schemas:** Delete `server/src/schemas/movie.schema.ts`
3. **Router:** Delete `server/src/routers/movie.router.ts`
4. **Main Router:** Remove movie router import from `server/src/router.ts`
5. **Frontend:** Delete `client/src/pages/movies/`
6. **Update App:** Modify `client/src/App.tsx` to your needs

Then push database changes:

```bash
cd server
pnpm run db:push
pnpm run db:generate
```

## Adding Authentication (WIP)

This boilerplate is designed to be extended with authentication. Popular options:

- NextAuth.js
- Clerk
- Auth0
- Custom JWT implementation

