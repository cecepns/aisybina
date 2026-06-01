import { get, post, put, del } from "../utils/request";
import { api } from "../utils/api";
import { API_ENDPOINTS } from "../utils/endpoints";

export const fetchProducts = (params) => get(API_ENDPOINTS.PRODUCTS.LIST, params);

export const fetchProduct = (id) => get(API_ENDPOINTS.PRODUCTS.DETAIL(id));

export const createProduct = (formData) =>
  api.post(API_ENDPOINTS.PRODUCTS.LIST, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const updateProduct = (id, formData) =>
  api.put(API_ENDPOINTS.PRODUCTS.DETAIL(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const deleteProduct = (id) => del(API_ENDPOINTS.PRODUCTS.DETAIL(id));

export const fetchCatalog = () => get(API_ENDPOINTS.CATALOG.LIST);
