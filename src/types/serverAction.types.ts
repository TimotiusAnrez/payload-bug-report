// Error types to identify the source/nature of errors
export enum ErrorSource {
  PAYLOAD = 'PAYLOAD',
  NEXTJS = 'NEXTJS',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  UNKNOWN = 'UNKNOWN',
}

// Base result structure for all server actions
export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: {
    source: ErrorSource
    message: string
    code?: string
    details?: unknown
  }
  httpStatus: number
}
