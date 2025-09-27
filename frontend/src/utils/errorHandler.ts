// utils/errorHandler.ts
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'حدث خطأ غير معروف';
};

export const logError = (context: string, error: unknown) => {
  console.error(`[${context}]`, {
    message: handleError(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
};