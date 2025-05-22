import { ActionResult, ErrorSource } from '@/types/serverAction.types'

// Helper to create a successful result
export function createSuccess<T>(data: T): ActionResult<T> {
  return {
    success: true,
    httpStatus: 200,
    data: data,
  }
}

// Helper to create an error result
export function createError<T = unknown>(
  source: ErrorSource,
  message: string,
  code?: string,
  details?: unknown,
): ActionResult<T> {
  return {
    success: false,
    error: {
      source,
      message,
      code,
      details,
    },
    httpStatus: 500,
  }
}

// PayloadCMS specific error handling
export function handlePayloadError(error: unknown): ActionResult {
  // Check if it's a PayloadCMS error
  if (error && typeof error === 'object' && 'errors' in error) {
    return createError(ErrorSource.PAYLOAD, 'Payload operation failed', undefined, error)
  }

  // Generic error fallback
  return createError(
    ErrorSource.UNKNOWN,
    error instanceof Error ? error.message : 'An unknown error occurred',
  )
}
