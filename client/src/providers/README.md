# Providers

This folder contains all React context providers organized for better maintainability and separation of concerns.

## Structure

```
providers/
├── AppProviders.tsx      # Main provider composition
├── ThemeProvider.tsx     # Theme context (dark/light/system)
├── QueryProvider.tsx     # TanStack Query client
├── index.ts             # Exports
└── README.md            # This file
```

## Usage

### Main App Setup

```tsx
import { AppProviders } from "@/providers";

function App() {
  return (
    <AppProviders>
      <YourApp />
    </AppProviders>
  );
}
```

### Individual Provider Usage

```tsx
import { ThemeProvider, useTheme } from "@/providers";

// Use individual providers if needed
function CustomApp() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}
```

## Adding New Providers

1. Create your provider component in this folder
2. Add it to `AppProviders.tsx` in the correct order
3. Export it from `index.ts`

### Example: Adding a new provider

```tsx
// providers/AuthProvider.tsx
export function AuthProvider({ children }) {
  // ... auth logic
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

// providers/AppProviders.tsx
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          {" "}
          {/* Add here */}
          {children}
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
```

## Provider Order

The current order is optimized for:

1. **ThemeProvider** - Sets up theme context and CSS variables
2. **QueryProvider** - Provides TanStack Query client and devtools

When adding new providers, consider dependencies and performance implications.
