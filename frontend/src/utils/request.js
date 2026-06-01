import { api } from "./api";

export async function get(url, params = {}) {
  const { data } = await api.get(url, { params });
  return data;
}

export async function post(url, body, config = {}) {
  const { data } = await api.post(url, body, config);
  return data;
}

export async function put(url, body, config = {}) {
  const { data } = await api.put(url, body, config);
  return data;
}

export async function patch(url, body) {
  const { data } = await api.patch(url, body);
  return data;
}

export async function del(url) {
  const { data } = await api.delete(url);
  return data;
}

export function getUploadUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  // Normalise so both raw filenames from the API (e.g. "1779.png")
  // and already-prefixed paths (e.g. "/uploads/1779.png") work.
  let normalized = path;
  if (!normalized.startsWith("/")) {
    // If backend only returns the filename, serve it from /uploads
    if (!normalized.includes("/")) {
      normalized = `/uploads/${normalized}`;
    } else {
      normalized = `/${normalized}`;
    }
  }

  // const base =
  //   import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3001";
  const base = "https://api.kingcreativestudio.my.id/aisybina/api"   

  return `${base}${normalized}`;
}
