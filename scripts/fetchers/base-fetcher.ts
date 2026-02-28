const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 2;
const USER_AGENT = "TechNewsAggregator/1.0";

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = DEFAULT_RETRIES
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", USER_AGENT);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    signal: options.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, fetchOptions);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function fetchJson<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetchWithRetry(url, {
    ...options,
    headers: { Accept: "application/json", ...(options.headers as Record<string, string>) },
  });
  return res.json() as Promise<T>;
}
