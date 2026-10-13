export const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";

/**
 * Panggil API backend (Django).
 * Dipakai di Server Component — jadi URL backend tidak bocor ke browser.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} gagal (HTTP ${res.status})`);
  }
  return (await res.json()) as T;
}
