import * as Sentry from '@sentry/react';
import type { FC } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ErrorPage } from '@/pages/ErrorPage/ui/ErrorPage';

export const RouteErrorFallback: FC = () => {
  const error = useRouteError();
  console.error('Route error captured:', error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <ErrorPage code="404" />;
    }
    if (error.status === 403) {
      return <ErrorPage code="403" />;
    }
    return <ErrorPage code={String(error.status)} message={error.statusText || error.data} />;
  }

  const message = error instanceof Error ? error.message : 'Внутренняя ошибка приложения';
  const errorObj = error instanceof Error ? error : null;

  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(errorObj || new Error(message));
  }

  return <ErrorPage code="500" message={message} error={errorObj} />;
};

export default RouteErrorFallback;
