import { create } from "zustand";

interface OverlayState {
  count: number;
  pushOverlay: () => void;
  popOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  count: 0,
  pushOverlay: () => set((s) => ({ count: s.count + 1 })),
  popOverlay: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}));
