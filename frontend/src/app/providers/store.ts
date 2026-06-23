import type { PayloadAction } from '@reduxjs/toolkit';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { topologyApi } from '../../shared/api/topologyApi';
import type { Alert, LayoutDirection, Theme } from '../../shared/libs';

export interface UIState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  searchQuery: string;
  alertFilter: Alert;
  layoutDirection: LayoutDirection; // Top-Bottom or Left-Right layout
  theme: Theme;
  isAlertsOpen: boolean;
  isEditMode: boolean;
  hideClients: boolean;
  heatmapMetric: 'none' | 'cpu' | 'ram' | 'temp';
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  }
  return 'light';
};

const initialUIState: UIState = {
  selectedNodeId: null,
  selectedEdgeId: null,
  searchQuery: '',
  alertFilter: 'all',
  layoutDirection: 'TB',
  theme: getInitialTheme(),
  isAlertsOpen: false,
  isEditMode: false,
  hideClients: false,
  heatmapMetric: 'none',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
      state.selectedEdgeId = null; // Deselect edge when selecting node
    },
    selectEdge: (state, action: PayloadAction<string | null>) => {
      state.selectedEdgeId = action.payload;
      state.selectedNodeId = null; // Deselect node when selecting edge
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setAlertFilter: (state, action: PayloadAction<Alert>) => {
      state.alertFilter = action.payload;
    },
    setLayoutDirection: (state, action: PayloadAction<LayoutDirection>) => {
      state.layoutDirection = action.payload;
    },
    toggleTheme: (state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
      state.theme = theme;
    },
    setAlertsOpen: (state, action: PayloadAction<boolean>) => {
      state.isAlertsOpen = action.payload;
    },
    toggleAlerts: (state) => {
      state.isAlertsOpen = !state.isAlertsOpen;
    },
    clearSelection: (state) => {
      state.selectedNodeId = null;
      state.selectedEdgeId = null;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
    toggleHideClients: (state) => {
      state.hideClients = !state.hideClients;
    },
    setHeatmapMetric: (state, action: PayloadAction<UIState['heatmapMetric']>) => {
      state.heatmapMetric = action.payload;
    },
  },
});

export const {
  selectNode,
  selectEdge,
  setSearchQuery,
  setAlertFilter,
  setLayoutDirection,
  toggleTheme,
  setAlertsOpen,
  toggleAlerts,
  clearSelection,
  toggleEditMode,
  setEditMode,
  toggleHideClients,
  setHeatmapMetric,
} = uiSlice.actions;

export const store = configureStore({
  reducer: {
    [topologyApi.reducerPath]: topologyApi.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(topologyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
