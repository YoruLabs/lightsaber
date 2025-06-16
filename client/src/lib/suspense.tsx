import { Suspense } from "react";
import type { ReactNode } from "react";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SuspenseFallback } from "@/components/ui/SuspenseFallback";

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Comprehensive Suspense wrapper that includes:
 * - React Suspense for loading states
 * - Error Boundary for error handling
 * - QueryErrorResetBoundary for TanStack Query integration
 */
export function SuspenseWrapper({
  children,
  fallback,
  errorFallback,
  onError,
}: SuspenseWrapperProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={
            errorFallback ||
            ((error, retry) => (
              <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <div className="text-red-600 dark:text-red-400 text-center">
                  <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
                  <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error.message}</p>
                  <div className="space-x-2">
                    <button
                      onClick={retry}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Try again
                    </button>
                    <button
                      onClick={reset}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Reset Query
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
          onError={onError}
        >
          <Suspense fallback={fallback || <SuspenseFallback />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/**
 * Lightweight Suspense wrapper for simple loading states
 */
export function SuspenseLoader({
  children,
  message = "Loading...",
  size = "md" as const,
}: {
  children: ReactNode;
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <Suspense fallback={<SuspenseFallback message={message} size={size} />}>{children}</Suspense>
  );
}
