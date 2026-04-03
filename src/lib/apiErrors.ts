import { NextResponse } from 'next/server';

/* ────────────────────────────────────────────────────────────────────────────
 *  Machine-readable error codes that every API route should use.
 *  The frontend can key off `code` instead of fragile string matching.
 * ──────────────────────────────────────────────────────────────────────── */

export enum ErrorCode {
  // Input / body
  VALIDATION_ERROR   = 'VALIDATION_ERROR',
  INVALID_JSON       = 'INVALID_JSON',
  INVALID_FILE_TYPE  = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE     = 'FILE_TOO_LARGE',

  // Auth
  UNAUTHORIZED       = 'UNAUTHORIZED',
  FORBIDDEN          = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_SUSPENDED  = 'ACCOUNT_SUSPENDED',
  ALREADY_VERIFIED   = 'ALREADY_VERIFIED',

  // OTP
  INVALID_OTP        = 'INVALID_OTP',
  OTP_EXPIRED        = 'OTP_EXPIRED',

  // Resources
  NOT_FOUND          = 'NOT_FOUND',
  CONFLICT           = 'CONFLICT',

  // Server
  DB_ERROR           = 'DB_ERROR',
  INTERNAL_ERROR     = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED    = 'NOT_IMPLEMENTED',
}

/**
 * Return a consistent JSON error response.
 *
 * Shape: `{ code: string, error: string }`
 */
export function apiError(
  code: ErrorCode,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json({ code, error: message }, { status });
}

/**
 * Classify a caught error and return a safe API response.
 * Never leaks raw error messages to the client.
 */
export function dbSafeError(err: unknown): NextResponse {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  const isDbError =
    lower.includes('whitelist') ||
    lower.includes('connect') ||
    lower.includes('atlas') ||
    lower.includes('topology') ||
    lower.includes('enotfound') ||
    lower.includes('buffering timed out');

  if (isDbError) {
    return apiError(
      ErrorCode.DB_ERROR,
      'Database connection failed. Please try again shortly.',
      503,
    );
  }

  return apiError(ErrorCode.INTERNAL_ERROR, 'Internal server error', 500);
}
