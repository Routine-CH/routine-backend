export function createResponse(
  statusCode: number,
  message: string,
  data?: any,
) {
  return {
    statusCode,
    message,
    data: data || null,
  };
}
