import { CASHFREE_MODE } from "./env";

let sdkPromise: Promise<unknown> | null = null;

export async function openCashfree(paymentSessionId: string, returnUrl: string) {
  if (typeof window === "undefined") throw new Error("Cashfree can only run in the browser");
  if (!sdkPromise) sdkPromise = import("@cashfreepayments/cashfree-js");
  const mod = (await sdkPromise) as { load: (o: { mode: string }) => Promise<{
    checkout: (o: { paymentSessionId: string; returnUrl?: string; redirectTarget?: string }) => Promise<unknown>;
  }> };
  const cashfree = await mod.load({ mode: CASHFREE_MODE });
  return cashfree.checkout({ paymentSessionId, returnUrl, redirectTarget: "_self" });
}
