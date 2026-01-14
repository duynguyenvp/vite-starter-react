import { getSeparatorPair } from '@/configs/curency';
import { AppConfigContext } from '@/contexts/AppConfigContext';
import { useContext } from 'react';

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within AppConfigProvider');
  }
  return context;
};

export const useCurrencySeparators = () => {
  const { currency } = useAppConfig();
  return {
    useThousandSeparator: currency.useThousandSeparator,
    ...getSeparatorPair(currency),
  };
};
