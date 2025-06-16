import { Spinner } from "./Spinner";

interface SuspenseFallbackProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  className?: string;
}

export function SuspenseFallback({
  message = "Loading...",
  size = "md",
  fullScreen = false,
  className = "",
}: SuspenseFallbackProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    : "min-h-[200px]";

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${containerClasses} ${className}`}
    >
      <Spinner size={size} className="text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );
}
