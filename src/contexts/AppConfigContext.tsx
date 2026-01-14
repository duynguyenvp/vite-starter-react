import { createContext } from 'react';
import { AppConfig } from './AppConfigProvider';

export const AppConfigContext = createContext<AppConfig | null>(null);
