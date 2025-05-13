import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Función para obtener el token CSRF de las cookies
const getCSRFToken = () => {
  const cookie = document.cookie.match(/csrftoken=([^;]+)/);
  return cookie ? cookie[1] : null;
};

const createApi = (resource) => {
  const api = axios.create({
    baseURL: `${URL}/api/${resource}/`,
    withCredentials: true, // Importante para incluir cookies
  });

  // Interceptor para añadir CSRF token a las peticiones no seguras (POST, PUT, PATCH, DELETE)
  api.interceptors.request.use((config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = getCSRFToken();
    }
    return config;
  });

  return {
    getAll: () => api.get("/"),
    getOne: (id) => api.get(`/${id}/`),
    create: (data) => api.post("/", data),
    update: (id, data) => api.put(`/${id}/`, data),
    delete: (id) => api.delete(`/${id}/`),
  };
};

export default createApi;