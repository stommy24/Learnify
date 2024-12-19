import { create } from 'zustand';

interface AnimationStep {
  id: string;
  content: string;
  duration: number;
  highlight?: string[];
  position?: { x: number; y: number };
}

interface AnimationState {
  steps: AnimationStep[];
  currentStep: number;
  isPlaying: boolean;
  setSteps: (steps: AnimationStep[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  setSteps: (steps) => set({ steps }),
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
  })),
  previousStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 0)
  })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false })
})); 