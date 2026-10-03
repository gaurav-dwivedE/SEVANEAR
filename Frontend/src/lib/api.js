import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && localStorage.getItem("sevanear_token") && !e.config.url.includes("/auth/")) {
      localStorage.removeItem("sevanear_token");
      window.location.assign("/login");
    }
    return Promise.reject(e);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sevanear_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalizes backend error shape ({status:'failed'|'error', message}) into a plain string.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return (
    error?.response?.data?.message ||
    (error?.request && !error?.response
      ? "Can't reach the server. Is the backend running?"
      : null) ||
    fallback
  );
}

// ---- Auth ----
export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  allUsers: () => api.get("/auth/users"),
};

// ---- Services ----
export const servicesApi = {
  list: () => api.get("/services"),
  get: (id) => api.get(`/services/${id}`),
  create: (payload) => api.post("/services", payload),
  update: (id, payload) => api.patch(`/services/${id}`, payload),
  remove: (id) => api.delete(`/services/${id}`),
};

// ---- Addresses ----
export const addressesApi = {
  list: () => api.get("/addresses"),
  create: (payload) => api.post("/addresses", payload),
  remove: (id) => api.delete(`/addresses/${id}`),
};

// ---- Applications (bookings) ----
export const applicationsApi = {
  mine: () => api.get("/applications"),
  create: (payload) => api.post("/applications", payload),
  all: (status) => api.get("/applications/all", { params: status ? { status } : {} }),
  update: (id, payload) => api.patch(`/applications/${id}`, payload),
  cancel: (id, payload) => api.post(`/applications/${id}/cancel`, payload),
  review: (id, payload) => api.post(`/applications/${id}/review`, payload),
};

// ---- Partners ----
export const partnersApi = {
  list: (service) => api.get("/partners", { params: service ? { service } : {} }),
  create: (payload) => api.post("/partners", payload),
};

// ---- Partner applications ("Become a Partner" intake) ----
export const partnerApplicationsApi = {
  submit: (payload) => api.post("/partner-applications", payload),
  all: (status) => api.get("/partner-applications", { params: status ? { status } : {} }),
  update: (id, payload) => api.patch(`/partner-applications/${id}`, payload),
};
