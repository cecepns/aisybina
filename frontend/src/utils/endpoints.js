export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  CATALOG: {
    LIST: "/catalog",
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id) => `/categories/${id}`,
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
  },
  CONTACT: {
    INQUIRY: "/contact/inquiry",
    INQUIRIES: "/contact/inquiries",
    INQUIRY_DETAIL: (id) => `/contact/inquiries/${id}`,
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },
};
