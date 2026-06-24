// import { configureStore } from '@reduxjs/toolkit';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { beforeEach, describe, expect, it } from 'vitest';
// import { authReducer, type RootState, uiReducer } from '@/app/providers/store';
// import { topologyApi } from '@/shared/api/topologyApi';
// import { LoginPage } from './LoginPage';

// const createTestStore = (preloadedState?: Partial<RootState>) => {
//   return configureStore({
//     reducer: {
//       [topologyApi.reducerPath]: topologyApi.reducer,
//       ui: uiReducer,
//       auth: authReducer,
//     },
//     preloadedState,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false,
//       }).concat(topologyApi.middleware),
//   });
// };

// describe('LoginPage Component', () => {
//   beforeEach(() => {
//     localStorage.clear();
//   });

//   it('renders login page correctly', () => {
//     const store = createTestStore();
//     render(
//       <Provider store={store}>
//         <LoginPage />
//       </Provider>,
//     );

//     expect(screen.getByPlaceholderText('Имя пользователя')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
//     expect(screen.getByText(/Демо-доступ:/i)).toBeInTheDocument();
//   });

//   it('shows error on invalid credentials', async () => {
//     const store = createTestStore();
//     render(
//       <Provider store={store}>
//         <LoginPage />
//       </Provider>,
//     );

//     const usernameInput = screen.getByPlaceholderText('Имя пользователя');
//     const passwordInput = screen.getByPlaceholderText('Пароль');
//     const submitBtn = screen.getByRole('button', { name: /Войти/i });

//     fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
//     fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

//     fireEvent.click(submitBtn);

//     // Wait for Antd validation and simulated delay (800ms) to finish
//     const alertElement = await screen.findByText(
//       'Неверное имя пользователя или пароль',
//       {},
//       { timeout: 2000 },
//     );
//     expect(alertElement).toBeInTheDocument();

//     expect(store.getState().auth.error).toBe('Неверное имя пользователя или пароль');
//     expect(store.getState().auth.isAuthenticated).toBe(false);
//   });

//   it('logs in successfully with correct credentials', async () => {
//     const store = createTestStore();
//     render(
//       <Provider store={store}>
//         <LoginPage />
//       </Provider>,
//     );

//     const usernameInput = screen.getByPlaceholderText('Имя пользователя');
//     const passwordInput = screen.getByPlaceholderText('Пароль');
//     const submitBtn = screen.getByRole('button', { name: /Войти/i });

//     fireEvent.change(usernameInput, { target: { value: 'admin' } });
//     fireEvent.change(passwordInput, { target: { value: 'admin' } });

//     fireEvent.click(submitBtn);

//     // Wait for state update
//     await waitFor(
//       () => {
//         expect(store.getState().auth.isAuthenticated).toBe(true);
//       },
//       { timeout: 2000 },
//     );

//     expect(store.getState().auth.username).toBe('admin');
//     expect(localStorage.getItem('isAuthenticated')).toBe('true');
//     expect(localStorage.getItem('username')).toBe('admin');
//   });

//   it('toggles theme when theme toggle is clicked', () => {
//     const store = createTestStore({
//       ui: {
//         selectedNodeId: null,
//         selectedEdgeId: null,
//         searchQuery: '',
//         alertFilter: 'all',
//         layoutDirection: 'TB',
//         theme: 'dark',
//         isAlertsOpen: false,
//         isEditMode: false,
//         hideClients: false,
//         heatmapMetric: 'none',
//       },
//     });

//     render(
//       <Provider store={store}>
//         <LoginPage />
//       </Provider>,
//     );

//     const toggleBtn = screen.getByTestId('theme-toggle-btn');
//     fireEvent.click(toggleBtn);

//     expect(store.getState().ui.theme).toBe('light');
//   });
// });
