import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './providers/store';
import { AppContent } from './ui/AppContent';
import './styles/index.scss';
import type { FC } from 'react';

export const App: FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
