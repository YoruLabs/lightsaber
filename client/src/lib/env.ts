// Environment configuration with fallbacks
export const env = {
  // Web3Auth Client ID - fallback to your provided ID if not set
  WEB3_AUTH_CLIENT_ID:
    import.meta.env.VITE_WEB3_AUTH_CLIENT_ID ||
    "BIjMpEui9tU2dAgQOrA0LBdwvu6-ouhNeYldZ6UQNFsSPjq--ztt4ug8cMeAAijPS4gRx6fFBZApp2WLqr-l0Nk",

  // App Environment - defaults to development
  APP_ENV: (import.meta.env.VITE_APP_ENV || "development") as
    | "development"
    | "production",

  // Derived values
  get isDevelopment() {
    return this.APP_ENV === "development";
  },

  get isProduction() {
    return this.APP_ENV === "production";
  },
} as const;

// Log environment info in development
if (env.isDevelopment) {
  console.log("🔧 Environment Configuration:", {
    APP_ENV: env.APP_ENV,
    WEB3_AUTH_CLIENT_ID: env.WEB3_AUTH_CLIENT_ID.slice(0, 10) + "...", // Only show first 10 chars for security
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
  });
}
