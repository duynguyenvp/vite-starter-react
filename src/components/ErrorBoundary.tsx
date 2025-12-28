import React from 'react';

type Props = { children: React.ReactNode };

type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for CI visibility

    console.error('Uncaught render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div data-cy="app-error" style={{ padding: 16, color: 'red' }}>
          <strong>Application error:</strong>
          <div>{String(this.state.error?.message)}</div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
