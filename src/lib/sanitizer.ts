import DOMPurify from 'isomorphic-dompurify';

/**
 * Recursively sanitizes input data.
 * - Trims whitespace from strings.
 * - Removes potentially malicious HTML/scripts using DOMPurify.
 * - Leaves other types (numbers, booleans, etc.) as is.
 * - Excludes specified keys from sanitization.
 */
export function sanitizeInput<T>(input: T, exclude: string[] = []): T {
  if (typeof input === 'string') {
    // Trim and sanitize string
    const trimmed = input.trim();
    return DOMPurify.sanitize(trimmed) as unknown as T;
  }

  if (Array.isArray(input)) {
    // Recursively sanitize array elements
    return input.map((item) => sanitizeInput(item, exclude)) as unknown as T;
  }

  if (input !== null && typeof input === 'object') {
    // Recursively sanitize object properties
    const sanitizedObj: Record<string, any> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        if (exclude.includes(key)) {
          sanitizedObj[key] = (input as any)[key];
        } else {
          sanitizedObj[key] = sanitizeInput((input as any)[key], exclude);
        }
      }
    }
    return sanitizedObj as unknown as T;
  }

  // Return as is for non-string/non-object types
  return input;
}
