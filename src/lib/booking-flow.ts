import { useEffect, useState } from "react";
import { apiFetch, putSignedUpload } from "./api";
import type { Booking, Member, SharingKind, TravelMode } from "./types";

const STORAGE_PREFIX = "rathgo:booking:";

export type BookingDraft = {
  bookingRef: string;
  booking: Booking;
};

function save(ref: string, booking: Booking) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + ref, JSON.stringify(booking));
  } catch { /* ignore */ }
}
function load(ref: string): Booking | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + ref);
    return raw ? (JSON.parse(raw) as Booking) : null;
  } catch { return null; }
}

export function useLocalBooking(ref: string | null) {
  const [booking, setBooking] = useState<Booking | null>(() => (ref ? load(ref) : null));
  useEffect(() => {
    if (!ref) { setBooking(null); return; }
    setBooking(load(ref));
    void (async () => {
      try {
        const fresh = await apiFetch<Booking>(`/api/bookings/${ref}`);
        setBooking(fresh);
        save(ref, fresh);
      } catch { /* ignore */ }
    })();
  }, [ref]);
  const update = (b: Booking) => { setBooking(b); save(b.bookingRef, b); };
  return { booking, update };
}

export async function createBooking(input: {
  tripId: number;
  batchId: number;
  sharingTypeId: number;
  travelMode: TravelMode;
  groupSize: number;
  referredById?: number | null;
  howHeard?: string;
}): Promise<Booking> {
  const b = await apiFetch<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
  save(b.bookingRef, b);
  return b;
}

export async function patchMembers(ref: string, members: Member[]): Promise<Member[]> {
  return apiFetch<Member[]>(`/api/bookings/${ref}/members`, {
    method: "PATCH",
    body: JSON.stringify({ members }),
  });
}

export async function uploadAadhar(
  ref: string,
  side: "front" | "back",
  file: File,
): Promise<string> {
  const contentType = file.type || "image/jpeg";
  const { uploadUrl, key } = await apiFetch<{ uploadUrl: string; key: string }>(
    `/api/bookings/${ref}/uploads/aadhar`,
    { method: "POST", body: JSON.stringify({ side, contentType }) },
  );
  await putSignedUpload(uploadUrl, file, contentType);
  return key;
}

export async function applyCoupon(ref: string, code: string): Promise<Booking> {
  return apiFetch<Booking>(`/api/bookings/${ref}/apply-coupon`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function checkoutBooking(ref: string): Promise<{
  orderId: string;
  paymentSessionId: string;
  totalAmount: number;
  bookingRef: string;
}> {
  return apiFetch(`/api/bookings/${ref}/checkout`, { method: "POST" });
}

export function sharingLabel(k: SharingKind) {
  return { double: "Double Sharing", triple: "Triple Sharing", quad: "Quad Sharing" }[k];
}
