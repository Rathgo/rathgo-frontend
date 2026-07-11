import { API_BASE_URL } from "./env";

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[] | string>;
  constructor(message: string, status: number, details?: Record<string, string[] | string>) {
    super(message);
    this.status = status;
    this.details = details;
  }
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
    const err = json as { error?: string; details?: Record<string, string[] | string> } | null;
    throw new ApiError(err?.error || `Request failed (${res.status})`, res.status, err?.details);
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
