import { z } from 'zod';
import Decimal from 'decimal.js';
import {
  parseDecimal,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  equals,
  isPositive,
  isNegative,
  isZero,
  isValid,
} from './decimal';

/**
 * Type definition cho DecimalSchema với các custom chain methods
 */
type DecimalSchemaType = z.ZodString & {
  greaterThanOrEqual: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  greaterThan: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  lessThanOrEqual: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  lessThan: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  equals: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  isPositive: (message?: string) => DecimalSchemaType;
  isNegative: (message?: string) => DecimalSchemaType;
  isZero: (message?: string) => DecimalSchemaType;
  maxDecimalPlaces: (places: number, message?: string) => DecimalSchemaType;
  min: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  max: (value: Decimal | string | number, message?: string) => DecimalSchemaType;
  range: (
    min: Decimal | string | number,
    max: Decimal | string | number,
    message?: string,
  ) => DecimalSchemaType;
};

/**
 * Tạo base decimal schema với validation cơ bản
 *
 * Lưu ý: Schema này luôn trả về string (không transform).
 * Form values sẽ là string, chỉ khi validate mới parse sang decimal để so sánh.
 *
 * @param message - Custom error message khi không phải decimal hợp lệ
 * @returns DecimalSchema với các chain methods (output type: string)
 */
function createDecimalSchema(message?: string): DecimalSchemaType {
  // Schema base là string, không transform
  const schema = z.string().refine(
    (val) => {
      if (val === '' || val === null || val === undefined) {
        return true; // Cho phép empty string (có thể dùng .min() để validate)
      }
      // Chỉ parse để kiểm tra tính hợp lệ, không transform giá trị
      return isValid(val);
    },
    {
      message: message || 'Giá trị phải là một số hợp lệ',
    },
  ) as unknown as DecimalSchemaType;

  return addDecimalMethods(schema);
}

/**
 * Helper function để format giá trị cho error message
 */
function formatValueForMessage(value: Decimal | string | number): string {
  if (value instanceof Decimal) {
    return value.toString();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
}

/**
 * Tạo decimal schema với validation cơ bản
 *
 * Schema này luôn trả về string (không transform).
 * Form values sẽ là string, chỉ khi validate mới parse sang decimal để so sánh.
 *
 * Sử dụng: decimal().greaterThanOrEqual(0).maxDecimalPlaces(2)
 *
 * @param message - Custom error message khi không phải decimal hợp lệ
 * @returns DecimalSchema với các chain methods (output type: string)
 */
export function decimal(message?: string): DecimalSchemaType {
  return createDecimalSchema(message);
}

/**
 * Tạo decimal schema yêu cầu bắt buộc (non-empty)
 *
 * Schema này luôn trả về string (không transform).
 * Form values sẽ là string, chỉ khi validate mới parse sang decimal để so sánh.
 *
 * Sử dụng: decimalRequired().greaterThan(0)
 *
 * @param message - Custom error message khi empty hoặc không hợp lệ
 * @returns DecimalSchema với các chain methods (output type: string)
 */
export function decimalRequired(message?: string): DecimalSchemaType {
  // Schema base là string, không transform
  const baseSchema = z
    .string()
    .min(1, message || 'Trường này là bắt buộc')
    .refine(
      (val) => {
        if (val === '' || val === null || val === undefined) {
          return false; // Không cho phép empty
        }
        // Chỉ parse để kiểm tra tính hợp lệ, không transform giá trị
        return isValid(val);
      },
      {
        message: message || 'Giá trị phải là một số hợp lệ',
      },
    ) as unknown as DecimalSchemaType;

  // Thêm các methods
  return addDecimalMethods(baseSchema);
}

/**
 * Helper function để thêm các decimal methods vào schema
 *
 * Tất cả các methods này:
 * - Input: string (từ form)
 * - Parse string -> decimal chỉ khi validate/so sánh
 * - Output: string (không transform giá trị form)
 */
function addDecimalMethods(schema: z.ZodString): DecimalSchemaType {
  const decimalSchema = schema as unknown as DecimalSchemaType;

  decimalSchema.greaterThanOrEqual = function (
    threshold: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        // Cho phép empty string (sẽ được validate bởi decimalRequired nếu cần)
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        // Parse string -> decimal chỉ để so sánh, không transform giá trị
        const result = greaterThanOrEqual(val, threshold);
        // Debug: log khi validation fail
        if (!result) {
          console.log(
            `[Decimal Validation] greaterThanOrEqual: "${val}" >= ${formatValueForMessage(threshold)} = ${result}`,
          );
        }
        return result;
      },
      {
        message:
          errorMessage || `Giá trị phải lớn hơn hoặc bằng ${formatValueForMessage(threshold)}`,
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.greaterThan = function (
    threshold: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return greaterThan(val, threshold);
      },
      {
        message: errorMessage || `Giá trị phải lớn hơn ${formatValueForMessage(threshold)}`,
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.lessThanOrEqual = function (
    threshold: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return lessThanOrEqual(val, threshold);
      },
      {
        message:
          errorMessage || `Giá trị phải nhỏ hơn hoặc bằng ${formatValueForMessage(threshold)}`,
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.lessThan = function (
    threshold: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return lessThan(val, threshold);
      },
      {
        message: errorMessage || `Giá trị phải nhỏ hơn ${formatValueForMessage(threshold)}`,
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.equals = function (
    value: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return equals(val, value);
      },
      {
        message: errorMessage || `Giá trị phải bằng ${formatValueForMessage(value)}`,
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.isPositive = function (errorMessage?: string): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return isPositive(val);
      },
      {
        message: errorMessage || 'Giá trị phải là số dương',
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.isNegative = function (errorMessage?: string): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return isNegative(val);
      },
      {
        message: errorMessage || 'Giá trị phải là số âm',
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.isZero = function (errorMessage?: string): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        return isZero(val);
      },
      {
        message: errorMessage || 'Giá trị phải bằng 0',
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.maxDecimalPlaces = function (
    places: number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const newSchema = (this as z.ZodString).refine(
      (val: string) => {
        if (val === '' || val === null || val === undefined) {
          return true;
        }
        const decimal = parseDecimal(val);
        if (decimal === null) {
          return false;
        }
        const str = decimal.toString();
        const decimalPart = str.split('.')[1];
        if (!decimalPart) {
          return true;
        }
        return decimalPart.length <= places;
      },
      {
        message: errorMessage || `Số chữ số thập phân không được vượt quá ${places}`,
      },
    ) as unknown as z.ZodString;
    return addDecimalMethods(newSchema);
  };

  decimalSchema.min = function (
    minValue: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    return this.greaterThanOrEqual(minValue, errorMessage);
  };

  decimalSchema.max = function (
    maxValue: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    return this.lessThanOrEqual(maxValue, errorMessage);
  };

  decimalSchema.range = function (
    minValue: Decimal | string | number,
    maxValue: Decimal | string | number,
    errorMessage?: string,
  ): DecimalSchemaType {
    const errorMsg =
      errorMessage ||
      `Giá trị phải trong khoảng từ ${formatValueForMessage(minValue)} đến ${formatValueForMessage(maxValue)}`;
    return this.greaterThanOrEqual(minValue, errorMsg).lessThanOrEqual(maxValue, errorMsg);
  };

  return decimalSchema;
}

/**
 * Tạo decimal schema từ number schema (transform number -> string)
 *
 * Lưu ý: Hàm này transform từ number sang string.
 * Chỉ sử dụng khi cần convert number input sang string format.
 *
 * Sử dụng: z.number().pipe(decimalFromNumber())
 *
 * @param message - Custom error message
 * @returns Schema transform từ number sang string
 */
export function decimalFromNumber(message?: string) {
  return z.number().transform((val) => {
    const decimal = parseDecimal(val);
    if (decimal === null) {
      throw new z.ZodError([
        {
          code: 'custom',
          message: message || 'Giá trị không hợp lệ',
          path: [],
        },
      ]);
    }
    return decimal.toString();
  });
}
