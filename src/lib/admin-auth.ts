import { useEffect, useSyncExternalStore } from "react";
import { apiFetch, ApiError } from "./api";

type Admin = { id: number; email: string; name?: string; role?: string };
type AuthState = {
  token: string | null;
  admin: Admin | null;
  ready: boolean; // true once initial silent-refresh attempted
};

let state: AuthState = { token: null, admin: null, ready: false };
const listeners = new Set<() => void>();

function set(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getAuthToken() {
  return state.token;
}

let refreshInflight: Promise<string | null> | null = null;

export async function refreshToken(): Promise<string | null> {
  if (refreshInflight) return refreshInflight;
  refreshInflight = (async () => {
    try {
      const data = await apiFetch<{ accessToken: string; admin?: Admin }>(
        "/api/admin/auth/refresh",
        { method: "POST", withCredentials: true },
      );
      set({ token: data.accessToken, admin: data.admin ?? state.admin, ready: true });
      return data.accessToken;
    } catch {
      set({ token: null, admin: null, ready: true });
      return null;
    } finally {
      refreshInflight = null;
    }
  })();
  return refreshInflight;
}

export async function adminLogin(email: string, password: string) {
  const data = await apiFetch<{ accessToken: string; admin: Admin }>(
    "/api/admin/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      withCredentials: true,
    },
  );
  set({ token: data.accessToken, admin: data.admin, ready: true });
  return data;
}

export async function adminLogout() {
  try {
    await apiFetch("/api/admin/auth/logout", { method: "POST", withCredentials: true });
  } catch {
    /* ignore */
  }
  set({ token: null, admin: null, ready: true });
}

/** apiFetch wrapper that attaches bearer + refreshes on 401 once. */
export async function adminFetch<T = unknown>(
  path: string,
  init: Parameters<typeof apiFetch>[1] = {},
): Promise<T> {
  const doCall = (token: string | null) =>
    apiFetch<T>(path, { ...init, bearer: token, withCredentials: true });

  if (!state.token) {
    const t = await refreshToken();
    if (!t) throw new ApiError("Not authenticated", 401);
    return doCall(t);
  }
  try {
    return await doCall(state.token);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      const t = await refreshToken();
      if (!t) throw e;
      return doCall(t);
    }
    throw e;
  }
}

export function useAdminAuth() {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
  useEffect(() => {
    if (!state.ready && !refreshInflight) {
      void refreshToken();
    }
  }, []);
  return s;
}
