import ReactDOM from "react-dom/client";

import { StrictMode } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { AppProviders } from "@/providers";
// Import the generated route tree
import { routeTree } from "@/routeTree.gen";
import "@/styles/styles.css";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  );
}
