import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import { LoadingFallback } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import router from '@/routes';
import '@styles/index.css';
import { AppConfigProvider } from './contexts/AppConfigProvider';

function App() {
  return (
    <AppConfigProvider
      config={{
        currency: {
          useThousandSeparator: true,
          separatorCharacter: ',',
        },
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback message="Loading application..." />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </AppConfigProvider>
  );
}

export default App;
