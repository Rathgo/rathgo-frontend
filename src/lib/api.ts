import { API_BASE_URL } from "./env";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    const readableDetails = collectValidationMessages(details);
    const normalizedMessage = readableDetails.length > 0
      ? `${message}: ${readableDetails.join("; ")}`
      : message;
    super(normalizedMessage);
    this.status = status;
    this.details = details;
  }
}

function formatFieldName(field: unknown): string {
  const path = Array.isArray(field) ? field.join(".") : String(field ?? "");
  return path
    .split(".")
    .filter(Boolean)
    .map((part) => part.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase()))
    .join(" → ");
}

function collectValidationMessages(details: unknown): string[] {
  const messages: string[] = [];
  const transparentKeys = new Set(["details", "errors", "fieldErrors", "issues", "validationErrors"]);

  const visit = (value: unknown, path: string[] = []) => {
    if (typeof value === "string") {
      const message = value.trim();
      if (message) messages.push(path.length > 0 ? `${formatFieldName(path)}: ${message}` : message);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => visit(entry, path));
      return;
    }

    if (typeof value !== "object" || value === null) return;

    const record = value as Record<string, unknown>;
    const message = record.message ?? record.reason;
    if (typeof message === "string") {
      const field = record.field ?? record.path ?? path;
      const label = formatFieldName(field);
      messages.push(label ? `${label}: ${message}` : message);
      return;
    }

    Object.entries(record).forEach(([key, child]) => {
      const nextPath = transparentKeys.has(key) || key === "formErrors" ? path : [...path, key];
      visit(child, nextPath);
    });
  };

  visit(details);
  return [...new Set(messages)];
}

export type ApiFetchOptions = RequestInit & {
  bearer?: string | null;
  /** Send credentials (refresh cookie). Defaults to omit for public calls. */
  withCredentials?: boolean;
  /** If true, don't unwrap { data }; return raw envelope */
  raw?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  { bearer, withCredentials, raw, headers, body, ...rest }: ApiFetchOptions = {},
): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(isForm ? {} : body ? { "Content-Type": "application/json" } : {}),
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body,
    credentials: withCredentials ? "include" : "omit",
  });

  let json: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new ApiError(text || `Request failed (${res.status})`, res.status);
    }
  }

  if (!res.ok || (json && typeof json === "object" && (json as { success?: boolean }).success === false)) {
    const err = json as { error?: string; message?: string; details?: unknown; errors?: unknown; validationErrors?: unknown } | null;
    throw new ApiError(
      err?.error || err?.message || `Request failed (${res.status})`,
      res.status,
      err?.details ?? err?.errors ?? err?.validationErrors,
    );
  }

  if (raw) return json as T;
  return ((json as { data?: T })?.data ?? (json as T));
}

/** Upload a file directly to a presigned PUT URL. No auth headers. */
export async function putSignedUpload(uploadUrl: string, file: File, contentType: string) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!res.ok) throw new ApiError(`Upload failed (${res.status})`, res.status);
}
