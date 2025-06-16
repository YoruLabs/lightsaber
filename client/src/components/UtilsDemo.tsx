import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ErrorBoundary,
  LazyImage,
  Spinner,
  ThemeToggle,
} from "@/components/ui";
import {
  useCopyToClipboard,
  useDebounce,
  useLocalStorage,
  useOnlineStatus,
} from "@/hooks";
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  formatRelativeTime,
  truncateText,
} from "@/lib/formatters";
import { SuspenseWrapper } from "@/lib/suspense";

// Mock data fetching function for suspense demo
const fetchUserData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: new Date("2023-01-15"),
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
  };
};

function SuspenseQueryDemo() {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: fetchUserData,
  });

  return (
    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
        Suspense Query Result
      </h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Joined:</strong> {formatDate(user.joinDate)}
        </p>
        <p>
          <strong>Last seen:</strong> {formatRelativeTime(user.lastSeen)}
        </p>
      </div>
    </div>
  );
}

function HooksDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useLocalStorage("demo-count", 0);
  const [isCopied, copy] = useCopyToClipboard();
  const isOnline = useOnlineStatus();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleCopy = () => {
    copy("Hello from client utils demo!");
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-3">Custom Hooks Demo</h3>

        {/* Online Status */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              isOnline
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${isOnline ? "bg-green-400" : "bg-red-400"}`}
            ></span>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* Local Storage */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Persistent Counter (localStorage):
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCount(count - 1)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              -
            </button>
            <span className="px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              {count}
            </span>
            <button
              onClick={() => setCount(count + 1)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Debounced Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Debounced Search (300ms delay):
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Debounced value: <strong>{debouncedSearchTerm}</strong>
          </p>
        </div>

        {/* Copy to Clipboard */}
        <div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isCopied
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormattersDemo() {
  const sampleDate = new Date("2024-01-15");
  const pastDate = new Date(Date.now() - 7200000); // 2 hours ago
  const samplePrice = 1234.56;
  const sampleBytes = 1048576; // 1MB
  const longText =
    "This is a very long text that needs to be truncated to show how the truncateText formatter works with long strings.";

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Formatters Demo</h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Date:</strong> {formatDate(sampleDate)}
        </p>
        <p>
          <strong>Relative time:</strong> {formatRelativeTime(pastDate)}
        </p>
        <p>
          <strong>Currency:</strong> {formatCurrency(samplePrice)}
        </p>
        <p>
          <strong>File size:</strong> {formatFileSize(sampleBytes)}
        </p>
        <p>
          <strong>Truncated:</strong> {truncateText(longText, 50)}
        </p>
      </div>
    </div>
  );
}

export function UtilsDemo() {
  const [showSuspenseDemo, setShowSuspenseDemo] = useState(false);
  const [triggerError, setTriggerError] = useState(false);

  const ErrorComponent = () => {
    if (triggerError) {
      throw new Error("This is a demo error!");
    }
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
        No error here!
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Client Utils Demo</h1>
        <ThemeToggle />
      </div>

      {/* Suspense Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Suspense & TanStack Query Integration
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSuspenseDemo(!showSuspenseDemo)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showSuspenseDemo ? "Hide" : "Show"} Suspense Demo
          </button>
        </div>

        {showSuspenseDemo && (
          <SuspenseWrapper
            fallback={
              <div className="flex items-center justify-center p-8">
                <Spinner size="lg" className="text-blue-500" />
                <span className="ml-3">Loading user data...</span>
              </div>
            }
          >
            <SuspenseQueryDemo />
          </SuspenseWrapper>
        )}
      </div>

      {/* Error Boundary Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Error Boundary</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTriggerError(!triggerError)}
            className={`px-4 py-2 rounded font-medium ${
              triggerError
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {triggerError ? "Fix Error" : "Trigger Error"}
          </button>
        </div>

        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      </div>

      {/* Lazy Image Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Lazy Loading Images with Skeleton UI
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Images load with beautiful skeleton animations. Scroll down to see
          lazy loading in action!
        </p>

        {/* Skeleton Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Different Skeleton Styles:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* With skeleton (default) */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                With Skeleton (Default)
              </h4>
              <LazyImage
                src={`https://picsum.photos/300/200?random=skeleton1`}
                alt="Image with skeleton loading"
                className="rounded-lg shadow-md"
                width={300}
                height={200}
                showSkeleton={true}
              />
            </div>

            {/* Without skeleton */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Without Skeleton
              </h4>
              <LazyImage
                src={`https://picsum.photos/300/200?random=noskeleton1`}
                alt="Image without skeleton loading"
                className="rounded-lg shadow-md"
                width={300}
                height={200}
                showSkeleton={false}
              />
            </div>

            {/* With placeholder blur */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                With Blur Placeholder
              </h4>
              <LazyImage
                src={`https://picsum.photos/300/200?random=blur1`}
                alt="Image with blur placeholder"
                placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                className="rounded-lg shadow-md"
                width={300}
                height={200}
                showSkeleton={true}
              />
            </div>
          </div>
        </div>

        {/* Gallery with lazy loading */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Lazy Loading Gallery:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scroll down to see images load as they come into view with skeleton
            animations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="space-y-2">
                <LazyImage
                  src={`https://picsum.photos/300/200?random=${i + 10}`}
                  alt={`Gallery image ${i + 1}`}
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  width={300}
                  height={200}
                  showSkeleton={true}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Image {i + 1}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Error state demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Error State:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LazyImage
              src="https://invalid-url-that-will-fail.com/image.jpg"
              alt="This image will fail to load"
              className="rounded-lg shadow-md"
              width={300}
              height={200}
              showSkeleton={true}
            />
          </div>
        </div>
      </div>

      {/* Custom Hooks Demo */}
      <HooksDemo />

      {/* Formatters Demo */}
      <FormattersDemo />

      <div className="text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
        <p>
          🎉 <strong>All utilities are working!</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>✅ Suspense with TanStack Query integration</li>
          <li>✅ Error boundaries with retry functionality</li>
          <li>✅ Lazy image loading with intersection observer</li>
          <li>✅ Theme system with dark/light/system modes</li>
          <li>
            ✅ Custom hooks (localStorage, debounce, online status, clipboard)
          </li>
          <li>✅ Formatting utilities (dates, currency, file sizes)</li>
        </ul>
      </div>
    </div>
  );
}
