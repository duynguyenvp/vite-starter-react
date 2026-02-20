import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import Layout from './Layout';
import { RouteErrorBoundary } from './RouteError';

const Page1 = lazy(() => import('@pages/Page1'));
const Page2 = lazy(() => import('@pages/Page2'));
const Page3 = lazy(() => import('@pages/Page3'));
const Page4 = lazy(() => import('@/pages/Page4'));

const router = createBrowserRouter([
  {
    Component: Layout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: '/',
        Component: Page1,
        ErrorBoundary: RouteErrorBoundary,
      },
      {
        path: '/page2',
        Component: Page2,
        ErrorBoundary: RouteErrorBoundary,
      },
      {
        path: '/page3',
        Component: Page3,
        ErrorBoundary: RouteErrorBoundary,
      },
      {
        path: '/page4',
        Component: Page4,
        ErrorBoundary: RouteErrorBoundary,
      },
    ],
  },
]);

export default router;
