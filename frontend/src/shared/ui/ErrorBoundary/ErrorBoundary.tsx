import * as Sentry from '@sentry/react';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { ErrorPage } from '@/pages/ErrorPage/ui/ErrorPage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, { extra: errorInfo as unknown as Record<string, unknown> });
    }
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage code="500" error={this.state.error} />;
    }

    return this.props.children;
  }
}
