export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiMethods<T> {
  getAll: () => Promise<ApiResponse<T[]>>;
  getOne: (id: number | string) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>) => Promise<ApiResponse<T>>;
  update: (id: number | string, data: Partial<T>) => Promise<ApiResponse<T>>;
  delete: (id: number | string) => Promise<ApiResponse<void>>;
}