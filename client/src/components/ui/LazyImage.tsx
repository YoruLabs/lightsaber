import { useState } from "react";

import { useIntersectionObserver } from "@/hooks";

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  showSkeleton?: boolean;
}

export function LazyImage({
  src,
  alt,
  placeholder,
  className = "",
  width,
  height,
  onLoad,
  onError,
  showSkeleton = true,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [setRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const shouldLoad = isIntersecting;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const SkeletonLoader = () => (
    <div
      className="relative overflow-hidden bg-gray-200 dark:bg-gray-800"
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse opacity-60" />

      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );

  return (
    <div
      ref={setRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!shouldLoad && showSkeleton && <SkeletonLoader />}

      {!shouldLoad && !showSkeleton && (
        <div
          className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-800"
          style={{ width, height }}
        >
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {shouldLoad && !isLoaded && !hasError && showSkeleton && (
        <SkeletonLoader />
      )}

      {shouldLoad && !hasError && (
        <div className="relative w-full h-full">
          {placeholder && !isLoaded && (
            <img
              src={placeholder}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-500 ${
                isLoaded ? "opacity-0" : "opacity-100"
              }`}
              style={{ width, height }}
            />
          )}

          <img
            src={src}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ width, height }}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      )}

      {hasError && (
        <div
          className="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600"
          style={{ width, height }}
        >
          <svg
            className="w-8 h-8 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <span className="text-gray-500 text-sm text-center px-2">
            Failed to load image
          </span>
        </div>
      )}
    </div>
  );
}
