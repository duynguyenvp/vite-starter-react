import React from 'react';
import { AppConfigContext } from './AppConfigContext';

export type CurrencyConfig =
  | {
      useThousandSeparator: false;
      separatorCharacter?: never;
    }
  | {
      useThousandSeparator: true;
      separatorCharacter: string;
    };

export interface AppConfig {
  currency: CurrencyConfig;
}
export const AppConfigProvider: React.FC<{
  config: AppConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  if (config.currency.useThousandSeparator && !config.currency.separatorCharacter) {
    throw new Error('currency.separatorCharacter is required when useThousandSeparator = true');
  }

  return <AppConfigContext.Provider value={config}>{children}</AppConfigContext.Provider>;
};
