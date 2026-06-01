import { get, post, put, del } from "../utils/request";
import { API_ENDPOINTS } from "../utils/endpoints";

export const fetchCategories = (params) =>
  get(API_ENDPOINTS.CATEGORIES.LIST, params);

export const fetchCategory = (id) => get(API_ENDPOINTS.CATEGORIES.DETAIL(id));

export const createCategory = (body) => post(API_ENDPOINTS.CATEGORIES.LIST, body);

export const updateCategory = (id, body) =>
  put(API_ENDPOINTS.CATEGORIES.DETAIL(id), body);

export const deleteCategory = (id) => del(API_ENDPOINTS.CATEGORIES.DETAIL(id));
