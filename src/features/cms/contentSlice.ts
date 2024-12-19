import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Resource {
  id: string;
  type: 'video' | 'image' | 'audio' | 'document' | 'interactive';
  url: string;
  title: string;
  description: string;
  duration?: number;
  fileSize?: number;
  tags: string[];
}

interface ContentItem {
  id: string;
  type: 'lesson' | 'exercise' | 'assessment';
  title: string;
  description: string;
  subject: 'english' | 'mathematics';
  yearGroup: number;
  topic: string;
  subtopic?: string;
  difficulty: 1 | 2 | 3;
  content: string;
  resources: Resource[];
  questions: string[];
  status: 'draft' | 'published' | 'archived';
  lastModified: string;
  createdBy: string;
}

interface ContentState {
  items: Record<string, ContentItem>;
  filters: {
    subject?: string;
    yearGroup?: number;
    topic?: string;
    type?: string;
    status?: string;
  };
  selectedItem: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  items: {},
  filters: {},
  selectedItem: null,
  isLoading: false,
  error: null
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, ContentItem>);
    },
    addContent: (state, action: PayloadAction<ContentItem>) => {
      state.items[action.payload.id] = action.payload;
    },
    updateContent: (state, action: PayloadAction<{
      id: string;
      updates: Partial<ContentItem>;
    }>) => {
      if (state.items[action.payload.id]) {
        state.items[action.payload.id] = {
          ...state.items[action.payload.id],
          ...action.payload.updates,
          lastModified: new Date().toISOString()
        };
      }
    },
    deleteContent: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    setFilters: (state, action: PayloadAction<ContentState['filters']>) => {
      state.filters = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItem = action.payload;
    }
  }
});

export const {
  setContent,
  addContent,
  updateContent,
  deleteContent,
  setFilters,
  setSelectedItem
} = contentSlice.actions;
export default contentSlice.reducer; 