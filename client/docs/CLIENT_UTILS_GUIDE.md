# Client Utilities Guide

This guide covers all the client-side utilities, hooks, and components built for modern React development with TanStack Query, Suspense, and advanced UX patterns.

## 🎯 Quick Answer to Your Questions

### Is Suspense Necessary with TanStack Query?

**Yes, but it's enhanced, not replaced!** TanStack Query v5 introduced `useSuspenseQuery` which works seamlessly with React Suspense:

- ✅ **Use Suspense for data loading states** - cleaner than managing `isLoading`
- ✅ **Perfect for route-level loading** - shows loading until all critical data loads
- ✅ **Great with lazy routes** - combines code-splitting with data fetching
- ⚠️ **Not always necessary** - regular `useQuery` still works for many use cases

### Lazy Image Loading Solution

We built a `LazyImage` component with intersection observer that:

- ✅ Only loads images when they enter the viewport
- ✅ Shows placeholders with blur effect
- ✅ Handles error states gracefully
- ✅ Works with responsive images

## 🏗️ Architecture Overview

```
client/src/
├── hooks/                    # Custom React hooks
│   ├── useLocalStorage.ts    # Persistent state
│   ├── useDebounce.ts        # Input optimization
│   ├── useIntersectionObserver.ts # Lazy loading
│   ├── useOnlineStatus.ts    # Network status
│   ├── useCopyToClipboard.ts # Clipboard API
│   └── index.ts              # Hook exports
├── lib/
│   ├── theme.tsx             # Theme system
│   ├── suspense.tsx          # Suspense wrappers
│   └── formatters.ts         # Data formatting
└── components/ui/
    ├── ErrorBoundary.tsx     # Error handling
    ├── Spinner.tsx           # Loading indicator
    ├── SuspenseFallback.tsx  # Suspense UI
    ├── LazyImage.tsx         # Lazy loading images
    ├── ThemeToggle.tsx       # Theme switcher
    └── index.ts              # Component exports
```

## 🪝 Custom Hooks

### useLocalStorage

Type-safe localStorage with React state synchronization:

```tsx
import { useLocalStorage } from "@/hooks";

function MyComponent() {
  const [user, setUser] = useLocalStorage("user", { name: "", email: "" });

  // Works exactly like useState, but persists to localStorage
  const updateUser = () => {
    setUser(prev => ({ ...prev, name: "John" }));
  };
}
```

### useDebounce

Optimize input performance and API calls:

```tsx
import { useDebounce } from "@/hooks";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Only triggers API call 300ms after user stops typing
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
}
```

### useIntersectionObserver

Build lazy loading and scroll-triggered animations:

```tsx
import { useIntersectionObserver } from "@/hooks";

function LazyComponent() {
  const [setRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  return <div ref={setRef}>{isIntersecting ? <ExpensiveComponent /> : <Placeholder />}</div>;
}
```

### useOnlineStatus

Track network connectivity:

```tsx
import { useOnlineStatus } from "@/hooks";

function NetworkIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <div className={isOnline ? "text-green-500" : "text-red-500"}>
      {isOnline ? "Online" : "Offline"}
    </div>
  );
}
```

### useCopyToClipboard

Modern clipboard API integration:

```tsx
import { useCopyToClipboard } from "@/hooks";

function ShareButton() {
  const [isCopied, copy] = useCopyToClipboard();

  return (
    <button onClick={() => copy("https://example.com")}>
      {isCopied ? "Copied!" : "Copy Link"}
    </button>
  );
}
```

## 🎨 Theme System

Complete dark/light/system theme with CSS variables:

```tsx
import { ThemeProvider, useTheme } from "@/lib/theme";

// Wrap your app
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// Use in components
function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {actualTheme}</p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
}
```

### CSS Variables Available

The theme system automatically sets these CSS variables:

```css
:root {
  --color-primary: 0 0 0; /* text color */
  --color-secondary: 255 255 255; /* bg color */
  --color-background: 255 255 255; /* page bg */
  --color-surface: 249 250 251; /* card bg */
}

/* Use in your CSS */
.my-component {
  background: rgb(var(--color-surface));
  color: rgb(var(--color-primary));
}
```

## ⚡ Suspense Integration

### SuspenseWrapper

Complete error handling + loading states:

```tsx
import { SuspenseWrapper } from "@/lib/suspense";

function MyRoute() {
  return (
    <SuspenseWrapper
      fallback={<CustomLoader />}
      errorFallback={(error, retry) => (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
    >
      <DataDrivenComponent />
    </SuspenseWrapper>
  );
}
```

### With TanStack Query

Using `useSuspenseQuery` for clean data fetching:

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";

function UserProfile({ userId }: { userId: string }) {
  // This will suspend until data loads
  const { data: user } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  // user is guaranteed to be defined here
  return <div>Hello {user.name}!</div>;
}

// Wrap with Suspense
function UserPage() {
  return (
    <SuspenseWrapper>
      <UserProfile userId="123" />
    </SuspenseWrapper>
  );
}
```

## 🖼️ Lazy Image Loading

Advanced lazy loading with placeholders and error handling:

```tsx
import { LazyImage } from "@/components/ui";

function ImageGallery() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img, i) => (
        <LazyImage
          key={i}
          src={img.url}
          alt={img.alt}
          placeholder={img.thumbnail} // Optional blur-up effect
          width={300}
          height={200}
          className="rounded-lg"
          onLoad={() => console.log("Image loaded")}
          onError={() => console.log("Image failed")}
        />
      ))}
    </div>
  );
}
```

## 🛡️ Error Boundaries

Graceful error handling with retry functionality:

```tsx
import { ErrorBoundary } from "@/components/ui";

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error reporting service
        console.error("App error:", error, errorInfo);
      }}
      fallback={(error, retry) => (
        <div className="error-page">
          <h1>Oops! Something went wrong</h1>
          <p>{error.message}</p>
          <button onClick={retry}>Try Again</button>
        </div>
      )}
    >
      <MyApp />
    </ErrorBoundary>
  );
}
```

## 🎛️ Formatting Utilities

Common data formatting functions:

```tsx
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  formatRelativeTime,
  truncateText,
} from "@/lib/formatters";

function DataDisplay() {
  const date = new Date();
  const pastDate = new Date(Date.now() - 3600000);

  return (
    <div>
      <p>Date: {formatDate(date)}</p>
      <p>Relative: {formatRelativeTime(pastDate)}</p>
      <p>Price: {formatCurrency(1234.56)}</p>
      <p>Size: {formatFileSize(1048576)}</p>
      <p>Text: {truncateText("Long text...", 50)}</p>
    </div>
  );
}
```

## 🎯 Best Practices

### When to Use Suspense

✅ **Good for:**

- Route-level loading (page transitions)
- Critical above-the-fold data
- Combining with lazy routes
- Simplifying loading state management

❌ **Avoid for:**

- Secondary/optional data
- User-triggered actions (button clicks)
- Pagination/infinite loading
- Real-time updates

### Performance Tips

1. **Use intersection observer for lazy loading**:

```tsx
// Instead of loading all images immediately
<img src="huge-image.jpg" />

// Use lazy loading
<LazyImage src="huge-image.jpg" alt="..." />
```

2. **Debounce expensive operations**:

```tsx
// Instead of API call on every keystroke
onChange={(e) => searchAPI(e.target.value)}

// Debounce the input
const debouncedValue = useDebounce(value, 300);
useEffect(() => searchAPI(debouncedValue), [debouncedValue]);
```

3. **Optimize with proper Suspense boundaries**:

```tsx
// Don't wrap entire app in one Suspense
<Suspense fallback={<Loading />}>
  <Header />      {/* This delays showing header */}
  <MainContent /> {/* Just because this is loading */}
  <Footer />      {/* This also waits */}
</Suspense>

// Instead, use granular boundaries
<>
  <Header />
  <Suspense fallback={<ContentLoader />}>
    <MainContent />
  </Suspense>
  <Footer />
</>
```

## 🚀 Quick Start

1. **Install dependencies** (already done in your project):

```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

2. **Import and use**:

```tsx
import { LazyImage, ThemeToggle } from "@/components/ui";
import { useDebounce, useLocalStorage } from "@/hooks";
import { SuspenseWrapper } from "@/lib/suspense";
```

3. **Add theme support**:

```tsx
// In main.tsx (already done)
import { ThemeProvider } from "@/lib/theme";

<ThemeProvider>
  <App />
</ThemeProvider>;
```

## 🎉 Demo

Check out the **Client Utils Demo** tab in your app to see all utilities in action:

- ✅ Live theme switching
- ✅ Suspense with TanStack Query
- ✅ Lazy loading images
- ✅ Error boundary with retry
- ✅ All custom hooks working
- ✅ Formatting utilities
- ✅ Online/offline detection

Your client is now equipped with modern React patterns and performance optimizations! 🚀
