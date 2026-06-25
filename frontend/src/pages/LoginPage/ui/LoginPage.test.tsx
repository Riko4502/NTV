import { configureStore, type Reducer, type UnknownAction } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { authReducer, type RootState, uiReducer } from '@/app/providers/store';
import { useLoginMutation } from '@/shared/api';
import { topologyApi } from '@/shared/api/topologyApi';
import LoginPage from './LoginPage';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

vi.mock('@/shared/api', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api')>('@/shared/api');
  return {
    ...actual,
    useLoginMutation: vi.fn(),
  };
});

const createTestStore = (preloadedState?: { ui?: RootState['ui']; auth?: RootState['auth'] }) => {
  return configureStore({
    reducer: {
      topologyApi: topologyApi.reducer,
      ui: uiReducer as Reducer<RootState['ui'], UnknownAction, RootState['ui'] | undefined>,
      auth: authReducer as Reducer<RootState['auth'], UnknownAction, RootState['auth'] | undefined>,
    },
    preloadedState,
  });
};

describe('LoginPage component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    vi.mocked(useLoginMutation).mockReturnValue([
      vi.fn(),
      {
        data: undefined,
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: undefined,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLoginMutation>);
  });

  it('renders the login form elements', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );

    expect(screen.getByPlaceholderText('Имя пользователя')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
    expect(screen.getByText(/Демо-доступ:/i)).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

    await waitFor(() => {
      expect(screen.getByText('Пожалуйста, введите имя пользователя')).toBeInTheDocument();
      expect(screen.getByText('Пожалуйста, введите пароль')).toBeInTheDocument();
    });
  });

  it('displays server error on failed login', async () => {
    const mockPromise = Object.assign(
      Promise.resolve({ error: { data: { message: 'Неверное имя пользователя или пароль' } } }),
      {
        unwrap: () => Promise.reject({ data: { message: 'Неверное имя пользователя или пароль' } }),
      },
    );
    const mockLogin = vi.fn().mockReturnValue(mockPromise);

    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      {
        data: undefined,
        isLoading: false,
        isError: true,
        isSuccess: false,
        error: { data: { message: 'Неверное имя пользователя или пароль' } },
        reset: vi.fn(),
      } as unknown as ReturnType<typeof useLoginMutation>[1],
    ] as unknown as ReturnType<typeof useLoginMutation>);

    const store = createTestStore();
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Имя пользователя'), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

    await waitFor(() => {
      expect(screen.getByText('Неверное имя пользователя или пароль')).toBeInTheDocument();
    });
    expect(store.getState().auth.error).toBe('Неверное имя пользователя или пароль');
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('logs in successfully and stores credentials', async () => {
    const mockPromise = Object.assign(Promise.resolve({ token: 'admin' }), {
      unwrap: () => Promise.resolve({ token: 'admin' }),
    });
    const mockLogin = vi.fn().mockReturnValue(mockPromise);

    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      {
        data: { token: 'admin' },
        isLoading: false,
        isError: false,
        isSuccess: true,
        error: undefined,
        reset: vi.fn(),
      } as unknown as ReturnType<typeof useLoginMutation>[1],
    ] as unknown as ReturnType<typeof useLoginMutation>);

    const store = createTestStore();
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Имя пользователя'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    expect(store.getState().auth.username).toBe('admin');
    expect(localStorage.getItem('isAuthenticated')).toBe('true');
    expect(localStorage.getItem('username')).toBe('admin');
  });

  it('toggles theme when theme button is clicked', () => {
    const store = createTestStore({
      ui: {
        selectedNodeId: null,
        selectedEdgeId: null,
        searchQuery: '',
        alertFilter: 'all',
        layoutDirection: 'TB',
        theme: 'dark',
        isAlertsOpen: false,
        isEditMode: false,
        hideClients: false,
        heatmapMetric: 'none',
      },
    });

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );

    const toggleBtn = screen.getByTestId('theme-toggle-btn');
    fireEvent.click(toggleBtn);
    expect(store.getState().ui.theme).toBe('light');
  });
});
