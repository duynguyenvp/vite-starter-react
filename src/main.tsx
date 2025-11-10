import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById('root')!).render(<App />);
