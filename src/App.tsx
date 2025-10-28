import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingFallback } from '@/components/Loading';
import router from '@/routes';
import '@styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback message="Loading application..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
