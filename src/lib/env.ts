export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://api.rathgo.com";

export const CASHFREE_MODE = ((import.meta.env.VITE_CASHFREE_MODE as string | undefined) ||
  "sandbox") as "sandbox" | "production";
