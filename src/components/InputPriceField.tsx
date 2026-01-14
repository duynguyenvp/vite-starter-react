import { Input } from 'antd';
import { NumericFormat } from 'react-number-format';
import React from 'react';
import { useCurrencySeparators } from '@/hooks/useAppConfig';

type InputPriceProps = {
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
  /**
   * Maximum number of decimal places allowed. Leave undefined to allow unlimited decimals.
   */
  decimalScale?: number;
  /**
   * Maximum number of integer digits (excluding sign). Defaults to 18.
   */
  maxIntegerDigits?: number;
  /**
   * Whether to allow negative values. Defaults to true.
   */
  allowNegative?: boolean;
};

const InputPriceField = React.forwardRef<HTMLInputElement, InputPriceProps>(
  (
    {
      value = '',
      onChange = () => {},
      name,
      decimalScale,
      maxIntegerDigits = 18,
      allowNegative = true,
    },
    ref,
  ) => {
    const currency = useCurrencySeparators();

    return (
      <NumericFormat
        data-testid={'input-price-field'}
        customInput={Input}
        placeholder="Enter price"
        value={value}
        inputMode="decimal"
        thousandSeparator={currency.thousandSeparator}
        decimalSeparator={currency.decimalSeparator}
        decimalScale={currency.useThousandSeparator ? decimalScale : 0}
        allowNegative={allowNegative}
        isAllowed={(vals) => {
          const raw = vals?.value ?? '';
          // split integer and decimal by dot or comma
          const intPart = raw.split(/[.,]/)[0] || '';
          const digits = intPart.startsWith('-') ? intPart.slice(1) : intPart;
          return digits.length <= maxIntegerDigits;
        }}
        onValueChange={(vals) => {
          onChange(vals.value);
        }}
        // forward ref to input element
        getInputRef={(el: HTMLInputElement | null) => {
          if (!ref) return;
          if (typeof ref === 'function') ref(el);
          // assign to ref.current when possible (avoid deprecated MutableRefObject)
          else if (ref && typeof ref === 'object')
            (ref as { current: HTMLInputElement | null }).current = el;
        }}
        name={name}
      />
    );
  },
);

InputPriceField.displayName = 'InputPriceField';

export default InputPriceField;
