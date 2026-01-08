import { create } from 'zustand'

export type CameraView = 'side' | 'front' | 'laptop' | 'book' | 'headphone'

interface CameraState {
  currentView: CameraView
  moveToFrontView: () => void
  moveToSideView: () => void
  moveToLaptopView: () => void
  moveToBookView: () => void
  moveToHeadphoneView: () => void
}

export const useCamera = create<CameraState>((set) => ({
  currentView: 'side',
  moveToFrontView: () => set({ currentView: 'front' }),
  moveToSideView: () => set({ currentView: 'side' }),
  moveToLaptopView: () => set({ currentView: 'laptop' }),
  moveToBookView: () => set({ currentView: 'book' }),
  moveToHeadphoneView: () => set({ currentView: 'headphone' }),
}))
