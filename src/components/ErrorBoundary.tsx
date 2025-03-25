import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error as Error) 
          : fallback;
      }

      // Default error UI
      return (
        <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 my-4 text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">
            Something went wrong
          </div>
          <div className="text-gray-300 text-sm mb-3">
            {error?.message || 'An unexpected error occurred'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

/**
 * Higher-order component to wrap a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return ComponentWithErrorBoundary;
}

/**
 * A component for displaying loading and error states
 */
export function DataLoader<T>({
  isLoading,
  isError,
  error,
  data,
  loadingComponent,
  errorComponent,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error: any;
  data: T | undefined;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode | ((error: any) => ReactNode);
  children: (data: T) => ReactNode;
}) {
  if (isLoading) {
    return loadingComponent || (
      <div className="animate-pulse p-4 rounded-md bg-gray-800 my-4">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (isError) {
    if (errorComponent) {
      return typeof errorComponent === 'function' 
        ? errorComponent(error) 
        : errorComponent;
    }

    return (
      <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 my-4">
        <div className="text-red-500 font-semibold mb-1">Failed to load data</div>
        <div className="text-gray-300 text-sm">
          {error?.message || 'An unexpected error occurred'}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/20 my-4">
        <div className="text-yellow-500 font-semibold">No data available</div>
      </div>
    );
  }

  return <>{children(data)}</>;
}
