const API_BASE = "/api";
const TOKEN_KEY = "roamly-token";

// The login is kept per browser tab (sessionStorage) so a host and a guest can be open in two tabs
// at the same time. localStorage is only used so that a brand-new tab starts logged in.
export const getToken = () => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

 const response = await fetch(`${API_BASE}${path}`, {
  ...options,
  cache: "no-store",
  headers,
  body:
    options.body && !(options.body instanceof FormData) &&
    typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body,
});
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
