export interface SearchFilters {
  difficulty: number[];
  topics: string[];
  types: string[];
}

export interface SearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: SearchFilters) => void;
  initialFilters: SearchFilters;
  value: string;
  onChange: (value: string) => void;
} 