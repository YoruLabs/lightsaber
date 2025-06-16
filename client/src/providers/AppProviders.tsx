import React from "react";

import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Web3Providers } from "./Web3AuthProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders - Centralized provider composition
 *
 * This component wraps all application providers in the correct order:
 * 1. ThemeProvider - Provides theme context and CSS variables
 * 2. Web3Providers - Provides Web3Auth, Wagmi, and TanStack Query for Web3
 * 3. QueryProvider - Provides additional TanStack Query client for general app queries
 *
 * Add new providers here to maintain a clean provider hierarchy.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <Web3Providers>
        <QueryProvider>{children}</QueryProvider>
      </Web3Providers>
    </ThemeProvider>
  );
}
