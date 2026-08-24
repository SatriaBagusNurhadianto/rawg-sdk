import { ValidationError } from '../errors';

/**
 * Validate that a required string parameter is provided
 */
export function validateRequired(
  value: unknown,
  fieldName: string,
): asserts value is string {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${fieldName} is required`, { field: fieldName });
  }
}

/**
 * Validate that a number is within a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}, got ${value}`,
      { field: fieldName },
    );
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: number, pageSize?: number): void {
  if (page !== undefined) {
    validateRange(page, 1, Number.MAX_SAFE_INTEGER, 'page');
  }
  if (pageSize !== undefined) {
    validateRange(pageSize, 1, 40, 'pageSize');
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(dateStr: string, fieldName: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new ValidationError(
      `${fieldName} must be in YYYY-MM-DD format, got ${dateStr}`,
      { field: fieldName },
    );
  }
}

/**
 * Validate comma-separated IDs
 */
export function validateCommaSeparatedIds(
  ids: number | number[],
  fieldName: string,
): number[] {
  const idArray = Array.isArray(ids) ? ids : [ids];

  if (idArray.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, {
      field: fieldName,
    });
  }

  if (!idArray.every((id) => Number.isInteger(id) && id > 0)) {
    throw new ValidationError(
      `${fieldName} must contain positive integers`,
      { field: fieldName },
    );
  }

  return idArray;
}

/**
 * Validate enum value
 */
export function validateEnum<T extends readonly unknown[]>(
  value: unknown,
  allowedValues: T,
  fieldName: string,
): asserts value is T[number] {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      { field: fieldName },
    );
  }
}