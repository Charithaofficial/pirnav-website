const DEFAULT_API_ORIGIN = "https://farrandly-interalar-talon.ngrok-free.dev";

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN?.trim().replace(/\/+$/, "") || DEFAULT_API_ORIGIN;

export const API_BASE_URL = `${API_ORIGIN}/api`;

export const buildApiUrl = (path = "") => {
  const normalizedPath = String(path).replace(/^\/+/, "");
  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
};

export const jsonApiHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};
