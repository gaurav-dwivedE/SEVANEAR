import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
export const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sevanear_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    const hasToken = localStorage.getItem("sevanear_token");
    const isAuthCall = e.config?.url?.includes("/auth/login") || e.config?.url?.includes("/auth/register");
    if (hasToken && !isAuthCall) {
      if (e.response?.data?.code === "BLOCKED") {
        localStorage.removeItem("sevanear_token");
        sessionStorage.setItem("sevanear_notice", e.response.data.message);
        window.location.assign("/login");
      } else if (e.response?.status === 401) {
        localStorage.removeItem("sevanear_token");
        window.location.assign("/login");
      }
    }
    return Promise.reject(e);
  }
);

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return (
    error?.response?.data?.message ||
    (error?.request && !error?.response ? "Can't reach the server. Please check your connection." : null) ||
    fallback
  );
}

const d = (p) => p.then((r) => r.data);
export const authApi = {
  register: (p) => api.post("/auth/register", p),
  login: (p) => api.post("/auth/login", p),
  me: () => api.get("/auth/me"),
  setPincode: (p) => api.patch("/auth/me/pincode", p),
  allUsers: () => api.get("/auth/users"),
  block: (id, blocked) => api.patch(`/auth/users/${id}/block`, { blocked }),
  removeUser: (id) => api.delete(`/auth/users/${id}`),
};
export const categoriesApi = {
  list: (all) => api.get("/categories", { params: all ? { all: 1 } : {} }),
  create: (p) => api.post("/categories", p),
  update: (id, p) => api.patch(`/categories/${id}`, p),
  remove: (id) => api.delete(`/categories/${id}`),
};
export const servicesApi = {
  list: (params) => api.get("/services", { params }),
  get: (id, params) => api.get(`/services/${id}`, { params }),
  reviews: (id) => api.get(`/services/${id}/reviews`),
  create: (p) => api.post("/services", p),
  update: (id, p) => api.patch(`/services/${id}`, p),
  remove: (id) => api.delete(`/services/${id}`),
};
export const addressesApi = {
  list: () => api.get("/addresses"),
  create: (p) => api.post("/addresses", p),
  update: (id, p) => api.patch(`/addresses/${id}`, p),
  remove: (id) => api.delete(`/addresses/${id}`),
};
export const applicationsApi = {
  mine: () => api.get("/applications"),
  get: (id) => api.get(`/applications/${id}`),
  create: (p) => api.post("/applications", p),
  all: (params) => api.get("/applications/all", { params }),
  update: (id, p) => api.patch(`/applications/${id}`, p),
  remove: (id) => api.delete(`/applications/${id}`),
  removeMine: (id) => api.delete(`/applications/${id}/mine`),
  cancel: (id, p) => api.post(`/applications/${id}/cancel`, p),
  review: (id, p) => api.post(`/applications/${id}/review`, p),
};
export const partnersApi = {
  list: (params) => api.get("/partners", { params }),
  create: (p) => api.post("/partners", p),
  update: (id, p) => api.patch(`/partners/${id}`, p),
  remove: (id) => api.delete(`/partners/${id}`),
};
export const partnerApplicationsApi = {
  submit: (p) => api.post("/partner-applications", p),
  all: (status) => api.get("/partner-applications", { params: status ? { status } : {} }),
  update: (id, p) => api.patch(`/partner-applications/${id}`, p),
};
const pinCache = {};
export async function lookupPincode(pin) {
  if (pinCache[pin]) return pinCache[pin];
  const { data } = await api.get(`/pincode/${pin}`);
  return (pinCache[pin] = data.data);
}
export async function uploadImage(file, folder = "services") {
  const fd = new FormData();
  fd.append("image", file);
  const { data } = await api.post(`/uploads?folder=${folder}`, fd);
  return data.data.url;
}
export { d };
