import React from "react";

import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { web3AuthContextConfig } from "@/lib/web3auth";

// Create a separate QueryClient for Web3/Wagmi operations
const web3QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute
      retry: 2,
    },
  },
});

interface Web3ProvidersProps {
  children: React.ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={web3QueryClient}>
        <WagmiProvider>{children}</WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
