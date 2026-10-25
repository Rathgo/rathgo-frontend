import * as XLSX from "xlsx";
import { deliverFile } from "@/lib/download";
import type { Booking } from "@/lib/types";

export type BookingExportRow = Booking & { primaryName?: string; primaryPhone?: string };

const money = (v: string | number) => Number(v || 0);
const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-IN") : "");

function primaryOf(b: BookingExportRow) {
  const member = b.members?.find((m) => m.isPrimary) ?? b.members?.[0];
  const name = b.primaryName || member?.fullName || "";
  const phone = b.primaryPhone || member?.phone || "";
  const email = member?.email || "";
  return { name, phone, email };
}

export function buildBookingsWorkbook(rows: BookingExportRow[]) {
  const bookings = rows.map((b) => {
    const p = primaryOf(b);
    return {
      "Booking Ref": b.bookingRef,
      "Trip": b.trip?.title ?? "",
      "Batch Start": fmtDate(b.batch?.startDate ?? ""),
      "Batch End": fmtDate(b.batch?.endDate ?? ""),
      "Primary Traveller": p.name,
      "Phone": p.phone,
      "Email": p.email,
      "Travellers": b.groupSize,
      "Sharing": b.sharingType?.kind ?? "",
      "Base Amount": money(b.baseAmount),
      "Discount": money(b.discountAmount),
      "GST": money(b.gstAmount),
      "Total Amount": money(b.totalAmount),
      "Payment Status": b.paymentStatus,
      "Booking Status": b.bookingStatus,
    };
  });

  const travellers = rows.flatMap((b) =>
    (b.members ?? []).map((m, i) => ({
      "Booking Ref": b.bookingRef,
      "Trip": b.trip?.title ?? "",
      "Member #": i + 1,
      "Primary": m.isPrimary ? "Yes" : "",
      "Full Name": m.fullName,
      "Age": m.age,
      "Gender": m.gender,
      "Phone": m.phone,
      "Email": m.email,
      "Address": m.address ?? "",
      "Medical Condition": m.medicalCondition ?? "",
    })),
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bookings), "Bookings");
  if (travellers.length > 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(travellers), "Travellers");
  }
  return wb;
}

export async function exportBookingsExcel(rows: BookingExportRow[], label: string) {
  const wb = buildBookingsWorkbook(rows);
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  await deliverFile(blob, `rathgo-bookings-${label}.xlsx`);
}
