import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import { LoadingFallback } from '@/components/Loading';
import router from '@/routes';
import '@styles/index.css';

function App() {
  return (
    <Suspense fallback={<LoadingFallback message="Loading application..." />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
