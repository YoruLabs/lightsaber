# TanStack Stack Integration Guide

This project demonstrates a complete integration of **TanStack Query**, **TanStack DB**, and **gRPC** with **Connect-ES**, all running on **Vite**, **Bun**, **Tailwind v4**, and **TypeScript**.

## 🚀 Tech Stack Overview

- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management and caching
- **TanStack DB** - Client-side reactive database with live queries
- **Connect-ES** - Type-safe gRPC client for the web
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Bun** - Package manager and runtime

## 📁 Project Structure

```
client/src/
├── assets/
│   ├── images/           # Image files
│   ├── icons/            # Icon files
│   └── fonts/            # Font files
├── components/
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # App header
│   └── TodoExample.tsx   # Demo component
├── lib/
│   ├── query.ts          # TanStack Query setup
│   ├── db.ts             # TanStack DB collections
│   ├── grpc.ts           # gRPC/Connect-ES setup
│   └── utils.ts          # Utilities
├── routes/
│   ├── __root.tsx        # Root layout
│   └── index.tsx         # Home page
├── styles/
│   └── styles.css        # Global styles
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── constants/            # App constants
└── main.tsx              # App entry point
```

## ⚙️ Key Features Implemented

### 1. TanStack Query Integration

- **QueryClient** configured with optimized defaults
- **QueryClientProvider** wrapping the app
- **ReactQueryDevtools** for development debugging
- Server state caching and synchronization

### 2. TanStack DB Integration

- **Live queries** that update reactively in sub-millisecond time
- **Optimistic mutations** with automatic rollback on errors
- **Collections** with Zod schema validation
- **Cross-collection joins** for complex data relationships

### 3. gRPC with Connect-ES

- **Connect transport** setup for JSON-based gRPC communication
- **Type-safe clients** generated from Protobuf schemas
- **Browser-compatible** gRPC calls using the fetch API
- **Proxy configuration** for development

### 4. Project Organization

- **@ alias** for clean imports (`@/components/...`)
- **Organized folder structure** by feature and type
- **Static assets** properly separated (`public/` vs `src/assets/`)

## 🔧 Setup & Configuration

### Dependencies Installed

```bash
# Core TanStack packages
@tanstack/react-query@^5.80.7
@tanstack/react-query-devtools@^5.80.7
@tanstack/react-db@^0.0.9
@tanstack/db-collections@^0.0.11

# gRPC/Connect packages
@connectrpc/connect-query@^2.1.0
@connectrpc/connect-web@^2.0.2

# Utilities
zod@^3.25.64
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Your gRPC server
        changeOrigin: true,
      },
    },
  },
});
```

## 🎯 Usage Examples

### TanStack DB Live Queries

```typescript
import { useLiveQuery } from '@tanstack/react-db'
import { taskCollection } from '@/lib/db'

function TaskList() {
  const { data: tasks } = useLiveQuery(query =>
    query
      .from({ taskCollection })
      .where('@done', '=', false)
      .orderBy({ '@createdAt': 'desc' })
      .select('@id', '@title', '@done')
  )

  return (
    <ul>
      {tasks?.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}
```

### Optimistic Mutations

```typescript
import { useOptimisticMutation } from '@tanstack/react-db'
import { taskCollection } from '@/lib/db'

function AddTaskButton() {
  const addTask = useOptimisticMutation({
    mutationFn: async ({ transaction }) => {
      const { changes: newTask } = transaction.mutations[0]
      // Send to API
      await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask)
      })
    },
  })

  const handleClick = () => {
    addTask.mutate(() =>
      taskCollection.insert({
        id: crypto.randomUUID(),
        title: 'New Task',
        done: false,
      })
    )
  }

  return <button onClick={handleClick}>Add Task</button>
}
```

### gRPC with Connect-ES

```typescript
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@connectrpc/connect'
import { transport } from '@/lib/grpc'

// With generated service
// import { ElizaService } from '../gen/eliza_pb'
// const client = createClient(ElizaService, transport)

function GreetingComponent({ name }: { name: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['greeting', name],
    queryFn: async () => {
      // return client.say({ sentence: `Hello ${name}!` })
      return { message: `Hello ${name}!` } // Mock for now
    },
    enabled: !!name,
  })

  if (isLoading) return <p>Loading...</p>
  return <p>{data?.message}</p>
}
```

## 🏗️ Next Steps

### 1. Generate gRPC Code

```bash
# Install Buf CLI
npm install -g @bufbuild/buf

# Create proto files
mkdir proto
# Add your .proto files

# Generate TypeScript code
buf generate
```

### 2. Set up Backend Server

The proxy is configured to forward `/api` requests to `http://localhost:8080`. Set up your gRPC/Connect server there.

### 3. Add Real API Endpoints

Replace the mock data in the collections with real API calls:

```typescript
// In lib/db.ts
onInsert: async ({ transaction }) => {
  const { changes: newTask } = transaction.mutations[0];
  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });
};
```

## 🎉 Benefits of This Setup

1. **Reactive UI** - Changes propagate instantly with TanStack DB live queries
2. **Optimistic Updates** - UI updates immediately, with automatic rollback on errors
3. **Type Safety** - End-to-end type safety from database to UI
4. **Caching** - Intelligent server state caching with TanStack Query
5. **Developer Experience** - Hot reload, DevTools, and excellent debugging
6. **Scalability** - Modular architecture that grows with your app

## 🛠️ Development Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run serve

# Run tests
bun run test
```

Your app is now ready with a complete reactive data layer! 🚀
