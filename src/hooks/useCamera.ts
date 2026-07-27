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
  moveToFrontView: () => set((state) => state.currentView === 'front' ? state : { currentView: 'front' }),
  moveToSideView: () => set((state) => state.currentView === 'side' ? state : { currentView: 'side' }),
  moveToLaptopView: () => set((state) => state.currentView === 'laptop' ? state : { currentView: 'laptop' }),
  moveToBookView: () => set((state) => state.currentView === 'book' ? state : { currentView: 'book' }),
  moveToHeadphoneView: () => set((state) => state.currentView === 'headphone' ? state : { currentView: 'headphone' }),
}))
