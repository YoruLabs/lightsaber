import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { TodoExample } from "@/components/TodoExample";
import { UtilsDemo } from "@/components/UtilsDemo";
import { Web3AuthDemo } from "@/components/Web3AuthDemo";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [activeTab, setActiveTab] = useState<"utils" | "todos" | "web3">(
    "utils",
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("utils")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "utils"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Client Utils Demo
            </button>
            <button
              onClick={() => setActiveTab("todos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "todos"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              TanStack Integration Demo
            </button>
            <button
              onClick={() => setActiveTab("web3")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "web3"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Web3Auth Wallet Demo
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "utils" && <UtilsDemo />}
        {activeTab === "todos" && <TodoExample />}
        {activeTab === "web3" && <Web3AuthDemo />}
      </div>
    </div>
  );
}
