# Saber Client

> Modern React client with TanStack ecosystem, advanced utilities, and beautiful UX patterns.

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20.11.0 (use `.nvmrc`)
- **Bun** (recommended) or npm/yarn

### Installation & Setup

```bash
# Use correct Node version
nvm use  # or fnm use

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at **http://localhost:3000**

## 🛠️ Tech Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling with CSS variables

### State & Data Management

- **TanStack Query v5** - Server state management with Suspense
- **TanStack Router** - Type-safe file-based routing
- **TanStack DB** - Client-side reactive database
- **Zod** - Runtime type validation

### Web3 & Blockchain

- **Web3Auth** - Social login and wallet authentication
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum

### Communication

- **Connect-ES** - Type-safe gRPC-web client
- **gRPC** - High-performance API communication

### Development Tools

- **Prettier** - Code formatting with import sorting
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing utilities

## 📁 Project Structure

```
client/
├── docs/                     # 📚 Documentation
│   ├── CLIENT_UTILS_GUIDE.md # Client utilities guide
│   └── INTEGRATION_GUIDE.md  # TanStack integration guide
├── src/
│   ├── providers/            # 🎯 React context providers
│   │   ├── AppProviders.tsx  # Main provider composition
│   │   ├── ThemeProvider.tsx # Dark/light theme system
│   │   └── QueryProvider.tsx # TanStack Query setup
│   ├── hooks/                # 🪝 Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── ...
│   ├── components/           # 🧩 React components
│   │   ├── ui/              # Reusable UI components
│   │   └── ...
│   ├── lib/                  # 🔧 Utilities & configuration
│   │   ├── query.ts         # TanStack Query setup
│   │   ├── db.ts            # TanStack DB collections
│   │   ├── grpc.ts          # gRPC client setup
│   │   └── ...
│   ├── routes/              # 📍 File-based routing
│   └── styles/              # 🎨 Global styles
├── .nvmrc                   # Node version specification
├── .prettierrc              # Code formatting rules
└── package.json             # Dependencies & scripts
```

## 🎯 Key Features

### 🎨 **Modern UI/UX**

- **Dark theme by default** with light/system options
- **Lazy image loading** with intersection observer
- **Responsive design** with Tailwind CSS
- **Smooth animations** and transitions

### ⚡ **Performance Optimized**

- **React Suspense** for loading states
- **Code splitting** with lazy routes
- **Debounced inputs** for better UX
- **Optimistic updates** with TanStack DB

### 🛡️ **Developer Experience**

- **Type-safe** throughout the stack
- **Error boundaries** with retry functionality
- **Hot reload** development
- **Comprehensive testing** setup

### 🔄 **Real-time Features**

- **Live queries** with TanStack DB
- **gRPC streaming** support
- **Offline detection** and handling
- **Optimistic mutations**

## 📜 Available Scripts

```bash
# Development
bun run dev          # Start dev server (localhost:3000)
bun run start        # Alias for dev

# Building
bun run build        # Build for production
bun run serve        # Preview production build

# Code Quality
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
bun run lint         # Run formatting + type check

# Testing
bun run test         # Run unit tests
```

## 🎮 Demo Features

Visit the app to explore:

### **Client Utils Demo**

- 🎨 Live theme switching (dark/light/system)
- 🖼️ Lazy loading image gallery
- 🔄 Suspense with TanStack Query
- 🛡️ Error boundary with retry
- 📱 Online/offline detection
- 📋 Copy to clipboard functionality
- ⏱️ Debounced search input
- 💾 Persistent localStorage state

### **TanStack Integration Demo**

- 📊 Live reactive queries
- ⚡ Optimistic mutations
- 🔄 Real-time data updates
- 🎯 Type-safe gRPC communication

## 🔧 Configuration

### Theme System

The app uses a sophisticated theme system with:

- **CSS custom properties** for dynamic theming
- **Tailwind dark mode** integration
- **System preference** detection
- **Persistent** user choice

### TanStack Query

Configured with optimized defaults:

- **60s stale time** for better caching
- **2 retries** on failure
- **Suspense integration** for loading states
- **DevTools** in development

### gRPC Setup

Ready for backend communication:

- **Connect-ES** transport
- **JSON format** for debugging
- **Proxy configuration** to localhost:8080
- **Type-safe** service definitions

## 📚 Documentation

- **[Client Utils Guide](./docs/CLIENT_UTILS_GUIDE.md)** - Comprehensive guide to all utilities and hooks
- **[Integration Guide](./docs/INTEGRATION_GUIDE.md)** - TanStack ecosystem integration details
- **[Providers README](./src/providers/README.md)** - Provider organization and usage

## 🚀 Getting Started

1. **Clone and setup**:

   ```bash
   cd client
   nvm use
   bun install
   ```

2. **Start development**:

   ```bash
   bun run dev
   ```

3. **Open browser**: http://localhost:3000

4. **Explore the demos** to see all features in action!

## 🤝 Contributing

1. **Format code**: `bun run format`
2. **Check types**: `bun run lint`
3. **Run tests**: `bun run test`
4. **Follow conventions** in the codebase

---

**Built with ❤️ using the TanStack ecosystem and modern React patterns.**

## ⚙️ Environment Variables

Create a `.env.local` file in the client directory with the following variables:

```bash
# Web3Auth Configuration
VITE_WEB3_AUTH_CLIENT_ID=your_web3auth_client_id_here

# Application Environment (development | production)
VITE_APP_ENV=development
```

### Environment Configuration

- **`VITE_WEB3_AUTH_CLIENT_ID`**: Your Web3Auth Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io)
- **`VITE_APP_ENV`**: Controls the environment-specific settings
  - `development` → Uses Sapphire DevNet for testing
  - `production` → Uses Sapphire MainNet for production

### Fallback Values

If environment variables are not set, the app will use:

- **Client ID**: The provided client ID as fallback
- **Environment**: `development` (Sapphire DevNet)

The configuration automatically logs environment info in development mode for debugging.
