/**
 * Thin JSON fetch wrapper — the single place a network call leaves the app.
 *
 * Controllers call the typed endpoint modules that sit next to this file; they
 * should never touch `fetch` or this client directly.
 */

/** Set `EXPO_PUBLIC_API_URL` in `.env` — Metro inlines `EXPO_PUBLIC_*` at build time. */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

/** Thrown for any non-2xx response, so callers can branch on `status`. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
    message?: string
  ) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & {
  /** Serialized as JSON; set `headers` yourself for anything else. */
  body?: unknown;
  /** Appended as a query string, skipping null/undefined values. */
  params?: Record<string, string | number | boolean | null | undefined>;
};

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = `${BASE_URL}${path}`;
  if (!params) return url;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) query.append(key, String(value));
  }

  const search = query.toString();
  return search ? `${url}?${search}` : url;
}

export async function request<T>(
  path: string,
  { body, params, headers, ...init }: RequestOptions = {}
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? null : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // 204 and empty bodies are valid successes — don't try to parse them.
  const raw = await response.text();
  const parsed: unknown = raw ? JSON.parse(raw) : null;

  if (!response.ok) throw new ApiError(response.status, parsed);

  return parsed as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
