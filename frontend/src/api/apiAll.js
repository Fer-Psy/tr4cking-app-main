import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const createApi = (resource) => {
  const api = axios.create({
    baseURL: `${URL}/api/${resource}/`,
  });

  return {
    getAll: () => api.get("/"),
    getOne: (id) => api.get(`/${id}/`),
    create: (datos) => api.post("/", datos),
    update: (id, datos) => api.put(`/${id}/`, datos),
    delete: (id) => api.delete(`/${id}/`),
  };
};

export default createApi;