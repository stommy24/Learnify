import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from './createSelectors';
import { 
  DashboardState, 
  ChartConfig,
  FilterOptions,
  ViewMode,
  ThemePreferences
} from '@/types/dashboard';

interface EnhancedDashboardState extends DashboardState {
  // View Management
  viewMode: ViewMode;
  layouts: Record<ViewMode, Layout[]>;
  chartConfigs: Record<string, ChartConfig>;
  
  // Data Management
  dataVersions: Record<string, number>;
  pendingUpdates: any[];
  
  // Theme & Preferences
  theme: ThemePreferences;
  accessibility: AccessibilitySettings;
  
  // Performance
  loadingStates: Record<string, boolean>;
  errors: Record<string, Error | null>;
  
  // Undo/Redo
  history: {
    past: Partial<DashboardState>[];
    future: Partial<DashboardState>[];
  };
}

interface EnhancedDashboardActions {
  // View Actions
  setViewMode: (mode: ViewMode) => void;
  updateLayout: (mode: ViewMode, layout: Layout[]) => void;
  updateChartConfig: (chartId: string, config: Partial<ChartConfig>) => void;
  
  // Data Actions
  updateData: (key: string, data: any) => void;
  queueUpdate: (update: any) => void;
  processPendingUpdates: () => void;
  
  // Theme Actions
  setTheme: (theme: Partial<ThemePreferences>) => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  
  // Utility Actions
  resetStore: () => void;
  exportState: () => string;
  importState: (state: string) => void;
}

const initialState: EnhancedDashboardState = {
  viewMode: 'default',
  layouts: {
    default: [],
    compact: [],
    expanded: []
  },
  chartConfigs: {},
  dataVersions: {},
  pendingUpdates: [],
  theme: {
    colorScheme: 'system',
    fontSize: 'medium',
    chartStyle: 'modern'
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    textToSpeech: false
  },
  loadingStates: {},
  errors: {},
  history: {
    past: [],
    future: []
  }
};

export const useEnhancedDashboardStore = create<
  EnhancedDashboardState & EnhancedDashboardActions
>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,

        setViewMode: (mode) =>
          set(state => {
            state.viewMode = mode;
          }),

        updateLayout: (mode, layout) =>
          set(state => {
            state.layouts[mode] = layout;
          }),

        updateChartConfig: (chartId, config) =>
          set(state => {
            state.chartConfigs[chartId] = {
              ...state.chartConfigs[chartId],
              ...config
            };
          }),

        updateData: (key, data) =>
          set(state => {
            state.dataVersions[key] = (state.dataVersions[key] || 0) + 1;
            state.cachedData[key] = {
              data,
              timestamp: Date.now(),
              version: state.dataVersions[key]
            };
          }),

        queueUpdate: (update) =>
          set(state => {
            state.pendingUpdates.push(update);
          }),

        processPendingUpdates: () =>
          set(state => {
            while (state.pendingUpdates.length > 0) {
              const update = state.pendingUpdates.shift();
              // Process update logic here
            }
          }),

        undo: () =>
          set(state => {
            if (state.history.past.length === 0) return;
            
            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);
            
            state.history.future.push(get());
            state.history.past = newPast;
            return { ...state, ...previous };
          }),

        redo: () =>
          set(state => {
            if (state.history.future.length === 0) return;
            
            const next = state.history.future[state.history.future.length - 1];
            const newFuture = state.history.future.slice(0, -1);
            
            state.history.past.push(get());
            state.history.future = newFuture;
            return { ...state, ...next };
          }),

        resetStore: () =>
          set(state => {
            return { ...initialState };
          }),

        exportState: () => JSON.stringify(get()),

        importState: (stateString) =>
          set(state => {
            const newState = JSON.parse(stateString);
            return { ...state, ...newState };
          })
      })),
      {
        name: 'enhanced-dashboard-store',
        partialize: (state) => ({
          theme: state.theme,
          accessibility: state.accessibility,
          layouts: state.layouts,
          chartConfigs: state.chartConfigs
        })
      }
    )
  )
); 