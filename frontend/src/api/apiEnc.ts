import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Función para obtener el token CSRF de las cookies
const getCSRFToken = (): string | null => {
  const cookie = document.cookie.match(/csrftoken=([^;]+)/);
  return cookie ? cookie[1] : null;
};

// Interface para los métodos de la API
interface ApiMethods<T> {
  getAll: () => Promise<AxiosResponse<T[]>>;
  getOne: (id: number | string) => Promise<AxiosResponse<T>>;
  create: (data: Omit<T, 'id'>) => Promise<AxiosResponse<T>>;
  update: (id: number | string, data: Partial<T>) => Promise<AxiosResponse<T>>;
  delete: (id: number | string) => Promise<AxiosResponse<void>>;
}

const createApi = <T extends { id?: number | string }>(resource: string): ApiMethods<T> => {
  const api: AxiosInstance = axios.create({
    baseURL: `${URL}/api/${resource}/`,
    withCredentials: true,
  });

  // Interceptor con tipo InternalAxiosRequestConfig
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers = config.headers || {};
      config.headers['X-CSRFToken'] = getCSRFToken();
    }
    return config;
  });

  return {
    getAll: () => api.get<T[]>("/"),
    getOne: (id: number | string) => api.get<T>(`/${id}/`),
    create: (data: Omit<T, 'id'>) => api.post<T>("/", data),
    update: (id: number | string, data: Partial<T>) => api.put<T>(`/${id}/`, data),
    delete: (id: number | string) => api.delete<void>(`/${id}/`),
  };
};

export default createApi;