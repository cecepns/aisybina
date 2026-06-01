import { get, post, patch, del } from "../utils/request";
import { API_ENDPOINTS } from "../utils/endpoints";

export const submitInquiry = (body) => post(API_ENDPOINTS.CONTACT.INQUIRY, body);

export const fetchInquiries = (params) =>
  get(API_ENDPOINTS.CONTACT.INQUIRIES, params);

export const updateInquiryStatus = (id, status) =>
  patch(API_ENDPOINTS.CONTACT.INQUIRY_DETAIL(id), { status });

export const deleteInquiry = (id) => del(API_ENDPOINTS.CONTACT.INQUIRY_DETAIL(id));
