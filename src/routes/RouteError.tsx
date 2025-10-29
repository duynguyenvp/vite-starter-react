import { type ReactNode } from 'react';
import { useRouteError } from 'react-router';

interface RouteErrorBoundaryProps {
  children?: ReactNode;
}

const isDevelopment = import.meta.env.MODE === 'development';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 rounded-lg bg-white shadow-lg max-w-lg w-full mx-4">
      <div className="mb-6">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">We're sorry, something went wrong</h2>
      <p className="text-gray-600 mb-6">
        {isDevelopment
          ? error.message || 'An unexpected error occurred'
          : 'We encountered an unexpected issue. Our team has been notified and is working on it.'}
      </p>
      {isDevelopment && (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-sm overflow-auto max-h-40">
          {error.stack}
        </pre>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Return Home
        </button>
      </div>
      {!isDevelopment && (
        <p className="mt-6 text-sm text-gray-500">Error ID: {crypto.randomUUID().split('-')[0]}</p>
      )}
    </div>
  </div>
);

export const RouteErrorBoundary = ({ children }: RouteErrorBoundaryProps): ReactNode => {
  const error = useRouteError();

  if (error) {
    return <ErrorFallback error={error as Error} />;
  }

  return children;
};
