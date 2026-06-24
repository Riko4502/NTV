import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/ui';
import { store } from './providers/store';
import './styles/index.scss';
import { type FC, useMemo } from 'react';
import { createRouter } from './router';

interface AppProps {
  basename?: string;
}

export const App: FC<AppProps> = ({ basename }) => {
  const router = useMemo(() => createRouter(basename), [basename]);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
