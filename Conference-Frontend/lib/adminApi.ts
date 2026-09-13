const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("admin_token");
}

export function adminLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  }
}

export async function adminFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getAdminToken();

  if (!token) {
    throw new Error("ADMIN_UNAUTHENTICATED");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    adminLogout();
    throw new Error("ADMIN_UNAUTHENTICATED");
  }

  return res;
}

export async function adminFetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await adminFetch(endpoint, options);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || "Something went wrong"
    );
  }

  return data;
}