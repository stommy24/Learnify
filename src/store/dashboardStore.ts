import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ViewPreferences {
  layout: 'grid' | 'list';
  theme: 'light' | 'dark';
  density: 'compact' | 'comfortable';
}

interface TimeframeFilter {
  start: Date;
  end: Date;
  preset?: 'today' | 'week' | 'month' | 'year';
}

interface DashboardState {
  activeFilters: string[];
  viewPreferences: ViewPreferences;
  cachedData: Record<string, any>;
  selectedTimeframe: TimeframeFilter;
  setActiveFilters: (filters: string[]) => void;
  setViewPreferences: (prefs: Partial<ViewPreferences>) => void;
  setCachedData: (key: string, data: any) => void;
  setSelectedTimeframe: (timeframe: TimeframeFilter) => void;
  clearCache: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      activeFilters: [],
      viewPreferences: {
        layout: 'grid',
        theme: 'light',
        density: 'comfortable',
      },
      cachedData: {},
      selectedTimeframe: {
        start: new Date(),
        end: new Date(),
        preset: 'today',
      },
      setActiveFilters: (filters) => set({ activeFilters: filters }),
      setViewPreferences: (prefs) =>
        set((state) => ({
          viewPreferences: { ...state.viewPreferences, ...prefs },
        })),
      setCachedData: (key, data) =>
        set((state) => ({
          cachedData: { ...state.cachedData, [key]: data },
        })),
      setSelectedTimeframe: (timeframe) =>
        set({ selectedTimeframe: timeframe }),
      clearCache: () => set({ cachedData: {} }),
    }),
    { name: 'dashboard-store' }
  )
); 