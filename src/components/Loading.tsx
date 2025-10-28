interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton = ({ className = 'w-full h-4' }: LoadingSkeletonProps) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    role="progressbar"
    aria-label="Loading..."
  />
);

export const CardSkeleton = () => (
  <div className="p-4 border rounded-lg shadow-sm">
    <LoadingSkeleton className="h-4 w-3/4 mb-4" />
    <LoadingSkeleton className="h-20 mb-4" />
    <LoadingSkeleton className="h-4 w-1/2" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex gap-4 py-2">
    <LoadingSkeleton className="h-4 w-1/4" />
    <LoadingSkeleton className="h-4 w-1/4" />
    <LoadingSkeleton className="h-4 w-1/4" />
    <LoadingSkeleton className="h-4 w-1/4" />
  </div>
);

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback = ({ message = 'Loading...' }: LoadingFallbackProps) => (
  <div className="flex items-center justify-center p-4">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500" />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  </div>
);
