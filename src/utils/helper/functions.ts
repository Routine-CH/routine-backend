type ApiResponse<T = unknown> = {
  message?: string;
  data: T;
};

export function createResponse<T = unknown>(
  message?: string,
  data?: any,
): ApiResponse<T> {
  return {
    message,
    data: data || ((Array.isArray(data) ? [] : {}) as T),
  };
}
