import Decimal from 'decimal.js';

/**
 * Cấu hình mặc định cho Decimal.js
 * Tắt scientific notation và set precision mặc định
 */
Decimal.set({
  toExpNeg: -9e15,
  toExpPos: 9e15,
  precision: 28,
});

/**
 * Chuyển đổi string số (có thể có format với dấu phẩy/chấm) thành Decimal
 * Hỗ trợ format: "1.234,56" (dấu chấm = thousand, dấu phẩy = decimal)
 * @param value - String số cần chuyển đổi
 * @returns Decimal instance hoặc null nếu không hợp lệ
 */
export function parseDecimal(value: string | number | Decimal | null | undefined): Decimal | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Decimal) {
    return value;
  }

  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      return null;
    }
    return new Decimal(value);
  }

  // Xử lý string
  const str = String(value).trim();
  if (str === '' || str === '-') {
    return null;
  }

  try {
    // Xác định decimal separator (dấu phẩy hoặc dấu chấm)
    // Nếu có cả dấu chấm và dấu phẩy, dấu cuối cùng là decimal separator
    let normalized = str;
    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');
    if (lastDot > -1 && lastComma > -1) {
      // Nếu cả hai đều tồn tại, dấu nào xuất hiện sau là decimal separator
      if (lastDot > lastComma) {
        // Dấu chấm là decimal separator, dấu phẩy là thousand separator
        normalized = str.replace(/,/g, '');
      } else {
        // Dấu phẩy là decimal separator, dấu chấm là thousand separator
        normalized = str.replace(/\./g, '').replace(',', '.');
      }
    } else if (lastComma > -1) {
      // Chỉ có dấu phẩy, dùng làm decimal separator
      normalized = str.replace(/\./g, '').replace(',', '.');
    } else if (lastDot > -1) {
      // Chỉ có dấu chấm, dùng làm decimal separator
      normalized = str.replace(/,/g, '');
    }
    // Nếu không có dấu chấm hoặc phẩy, giữ nguyên
    return new Decimal(normalized);
  } catch {
    return null;
  }
}

/**
 * Chuyển đổi Decimal thành string với format định dạng
 * @param value - Decimal instance hoặc giá trị có thể parse
 * @param options - Tùy chọn format
 * @returns String đã format hoặc empty string nếu không hợp lệ
 */
export function formatDecimal(
  value: Decimal | string | number | null | undefined,
  options?: {
    decimalPlaces?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    showTrailingZeros?: boolean;
  },
): string {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return '';
  }

  const {
    decimalPlaces,
    thousandSeparator = '.',
    decimalSeparator = ',',
    showTrailingZeros = false,
  } = options || {};

  let formatted: string;

  if (decimalPlaces !== undefined) {
    formatted = decimal.toFixed(decimalPlaces, Decimal.ROUND_HALF_UP);
  } else {
    formatted = decimal.toString();
  }

  // Tách phần nguyên và phần thập phân
  const [integerPart, decimalPart = ''] = formatted.split('.');

  // Thêm thousand separator cho phần nguyên
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  // Xử lý phần thập phân
  let formattedDecimal = decimalPart;
  if (!showTrailingZeros && decimalPart) {
    formattedDecimal = decimalPart.replace(/0+$/, '');
  }

  // Kết hợp lại
  if (formattedDecimal) {
    return `${formattedInteger}${decimalSeparator}${formattedDecimal}`;
  }
  return formattedInteger;
}

/**
 * Cộng hai số
 */
export function add(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): Decimal | null {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return null;
  }
  return decA.add(decB);
}

/**
 * Trừ hai số
 */
export function subtract(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): Decimal | null {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return null;
  }
  return decA.sub(decB);
}

/**
 * Nhân hai số
 */
export function multiply(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): Decimal | null {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return null;
  }
  return decA.mul(decB);
}

/**
 * Chia hai số
 */
export function divide(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): Decimal | null {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null || decB.isZero()) {
    return null;
  }
  return decA.div(decB);
}

/**
 * So sánh: a > b
 */
export function greaterThan(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): boolean {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return false;
  }
  return decA.greaterThan(decB);
}

/**
 * So sánh: a >= b
 */
export function greaterThanOrEqual(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): boolean {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return false;
  }
  return decA.greaterThanOrEqualTo(decB);
}

/**
 * So sánh: a < b
 */
export function lessThan(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): boolean {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return false;
  }
  return decA.lessThan(decB);
}

/**
 * So sánh: a <= b
 */
export function lessThanOrEqual(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): boolean {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return false;
  }
  return decA.lessThanOrEqualTo(decB);
}

/**
 * So sánh: a === b
 */
export function equals(
  a: Decimal | string | number | null | undefined,
  b: Decimal | string | number | null | undefined,
): boolean {
  const decA = parseDecimal(a);
  const decB = parseDecimal(b);
  if (decA === null || decB === null) {
    return false;
  }
  return decA.equals(decB);
}

/**
 * Làm tròn số
 */
export function round(
  value: Decimal | string | number | null | undefined,
  decimalPlaces: number = 0,
): Decimal | null {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return null;
  }
  return decimal.toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP);
}

/**
 * Làm tròn xuống (floor)
 */
export function floor(
  value: Decimal | string | number | null | undefined,
  decimalPlaces: number = 0,
): Decimal | null {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return null;
  }
  return decimal.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN);
}

/**
 * Làm tròn lên (ceil)
 */
export function ceil(
  value: Decimal | string | number | null | undefined,
  decimalPlaces: number = 0,
): Decimal | null {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return null;
  }
  return decimal.toDecimalPlaces(decimalPlaces, Decimal.ROUND_UP);
}

/**
 * Lấy giá trị tuyệt đối
 */
export function abs(value: Decimal | string | number | null | undefined): Decimal | null {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return null;
  }
  return decimal.abs();
}

/**
 * Kiểm tra số có hợp lệ không
 */
export function isValid(value: string | number | Decimal | null | undefined): boolean {
  return parseDecimal(value) !== null;
}

/**
 * Kiểm tra số có bằng 0 không
 */
export function isZero(value: Decimal | string | number | null | undefined): boolean {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return false;
  }
  return decimal.isZero();
}

/**
 * Kiểm tra số có dương không
 */
export function isPositive(value: Decimal | string | number | null | undefined): boolean {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return false;
  }
  return decimal.isPositive();
}

/**
 * Kiểm tra số có âm không
 */
export function isNegative(value: Decimal | string | number | null | undefined): boolean {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return false;
  }
  return decimal.isNegative();
}

/**
 * Lấy giá trị số từ Decimal (number)
 * Lưu ý: Có thể mất độ chính xác với số lớn
 */
export function toNumber(value: Decimal | string | number | null | undefined): number | null {
  const decimal = parseDecimal(value);
  if (decimal === null) {
    return null;
  }
  return decimal.toNumber();
}

/**
 * Tính tổng của một mảng các số
 */
export function sum(values: Array<Decimal | string | number | null | undefined>): Decimal | null {
  if (values.length === 0) {
    return new Decimal(0);
  }

  let result = new Decimal(0);
  for (const value of values) {
    const decimal = parseDecimal(value);
    if (decimal === null) {
      return null;
    }
    result = result.add(decimal);
  }
  return result;
}

/**
 * Tính trung bình của một mảng các số
 */
export function average(
  values: Array<Decimal | string | number | null | undefined>,
): Decimal | null {
  if (values.length === 0) {
    return null;
  }

  const total = sum(values);
  if (total === null) {
    return null;
  }

  return total.div(values.length);
}

/**
 * Tìm giá trị lớn nhất trong mảng
 */
export function max(values: Array<Decimal | string | number | null | undefined>): Decimal | null {
  if (values.length === 0) {
    return null;
  }

  let maxValue: Decimal | null = null;
  for (const value of values) {
    const decimal = parseDecimal(value);
    if (decimal === null) {
      continue;
    }
    if (maxValue === null || decimal.greaterThan(maxValue)) {
      maxValue = decimal;
    }
  }
  return maxValue;
}

/**
 * Tìm giá trị nhỏ nhất trong mảng
 */
export function min(values: Array<Decimal | string | number | null | undefined>): Decimal | null {
  if (values.length === 0) {
    return null;
  }

  let minValue: Decimal | null = null;
  for (const value of values) {
    const decimal = parseDecimal(value);
    if (decimal === null) {
      continue;
    }
    if (minValue === null || decimal.lessThan(minValue)) {
      minValue = decimal;
    }
  }
  return minValue;
}
