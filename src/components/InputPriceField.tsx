import { Input } from 'antd';
import { NumericFormat } from 'react-number-format';
import React from 'react';

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
};

const InputPriceField = React.forwardRef<HTMLInputElement, InputPriceProps>(
  ({ value = '', onChange = () => {}, name, decimalScale, maxIntegerDigits = 18 }, ref) => {
    return (
      <NumericFormat
        data-testid={'input-price-field'}
        customInput={Input}
        placeholder="Enter price"
        value={value}
        inputMode="decimal"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={decimalScale}
        allowNegative={true}
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
