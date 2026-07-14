// Razorpay Checkout.js loader + opener.

export interface RazorpayCheckoutResponse {
  razorpayOrderId: string;
  keyId: string;
  amountInPaise: number;
  currency: string;
  bookingRef: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillPhone?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (resp: unknown) => void) => void;
}
interface RazorpayCtor {
  new (options: Record<string, unknown>): RazorpayInstance;
}
declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let loadPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Razorpay requires a browser"));
  if (window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
    const el = existing ?? Object.assign(document.createElement("script"), { src: SCRIPT_URL, async: true });
    el.addEventListener("load", () => resolve());
    el.addEventListener("error", () => { loadPromise = null; reject(new Error("Failed to load Razorpay")); });
    if (!existing) document.head.appendChild(el);
  });
  return loadPromise;
}

export async function openRazorpay(
  res: RazorpayCheckoutResponse,
  onDone: () => void,
): Promise<void> {
  await loadScript();
  const Rzp = window.Razorpay;
  if (!Rzp) throw new Error("Razorpay SDK not available");
  const rzp = new Rzp({
    key: res.keyId,
    amount: res.amountInPaise,
    currency: res.currency,
    order_id: res.razorpayOrderId,
    name: "Chetan Tours Solution",
    description: `Booking ${res.bookingRef}`,
    prefill: {
      name: res.prefillName ?? "",
      email: res.prefillEmail ?? "",
      contact: res.prefillPhone ?? "",
    },
    theme: { color: "#e11d2a" },
    handler: () => onDone(),
    modal: { ondismiss: () => onDone() },
  });
  rzp.open();
}
