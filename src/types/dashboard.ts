export interface DashboardState {
  activeFilters: string[];
  viewPreferences: ViewPreferences;
  selectedTimeframe: TimeframeFilter;
  cachedData: Record<string, any>;
}

export interface ViewPreferences {
  layout: 'grid' | 'list';
  theme: 'light' | 'dark';
  density: 'compact' | 'comfortable';
}

export interface TimeframeFilter {
  start: Date;
  end: Date;
  preset?: 'today' | 'week' | 'month' | 'year';
} 