type ApiResponse<T = unknown> = {
  statusCode: number;
  message: string;
  data: T;
};

export function createResponse<T = unknown>(
  statusCode: number,
  message: string,
  data?: any,
): ApiResponse<T> {
  return {
    statusCode,
    message,
    data: data || ((Array.isArray(data) ? [] : {}) as T),
  };
}
