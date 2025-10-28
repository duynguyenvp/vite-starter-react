import { type ReactNode, useState, useCallback, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const DefaultErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred'}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      setError(new Error(event.reason));
    };

    // Handle runtime errors
    window.addEventListener('error', handleError);
    // Handle promise rejections
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  const reset = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  if (error) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <DefaultErrorFallback error={error} reset={reset} />;
  }

  try {
    return <>{children}</>;
  } catch (e) {
    setError(e as Error);
    return null;
  }
};

export default ErrorBoundary;
