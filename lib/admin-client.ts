const STORAGE_KEY = "furni-admin-key"

export function getAdminAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const key = sessionStorage.getItem(STORAGE_KEY)
  return key ? { Authorization: `Bearer ${key}` } : {}
}

export async function adminFetch(input: string, init?: RequestInit) {
  return fetch(input, {
    ...init,
    headers: {
      ...getAdminAuthHeaders(),
      ...init?.headers,
    },
  })
}
