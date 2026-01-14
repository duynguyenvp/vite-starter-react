import { CurrencyConfig } from './contexts/AppConfigContext';

export interface SeparatorPair {
  thousandSeparator: string;
  decimalSeparator: string;
}

export interface CurrencySeparatorConfig {
  useThousandSeparator: boolean;
  separatorCharacter?: ',' | '.';
}

export function getSeparatorPair(config: CurrencyConfig): SeparatorPair {
  const { useThousandSeparator, separatorCharacter } = config;

  // Default (US format)
  if (!useThousandSeparator || separatorCharacter === '.') {
    return {
      thousandSeparator: ',',
      decimalSeparator: '.',
    };
  }
  // VN / EU format
  return {
    thousandSeparator: '.',
    decimalSeparator: ',',
  };
}
