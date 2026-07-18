/**
 * Generic wrapper for tool execution results.
 */
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string; // ISO 8601
}

/**
 * Helper to create a successful result.
 */
export function successResult<T>(data: T): ToolResult<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Helper to create an error result.
 */
export function errorResult<T = null>(error: string): ToolResult<T> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}
