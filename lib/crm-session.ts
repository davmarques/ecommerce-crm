import { fetchCategories, fetchCurrentUser, fetchProducts } from "@/lib/api";

const TOKEN_KEY = "crm-auth-token";

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function clearStoredToken() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchCrmSnapshot(token: string) {
  const user = await fetchCurrentUser(token);
  const [products, categories] = await Promise.all([
    fetchProducts(token, user.tenantId),
    fetchCategories(token, user.tenantId),
  ]);

  return {
    user,
    products,
    categories,
  };
}
