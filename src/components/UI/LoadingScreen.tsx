import { useProgress } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'

interface LoadingScreenProps {
  onLoaded: () => void
}

const loadingImages = {
  0: '/loading/0percent.png',
  10: '/loading/10percent.png',
  20: '/loading/20percent.png',
  30: '/loading/30percent.png',
  40: '/loading/40percent.png',
  50: '/loading/50percent.png',
  60: '/loading/60percent.png',
  70: '/loading/70percent.png',
  80: '/loading/80percent.png',
  90: '/loading/90percent.png',
  100: '/loading/100percent.png'
}

const TOTAL_LOADING_TIME = 4000

export function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const { progress, active } = useProgress()
  const [isVisible, setIsVisible] = useState(true)
  const [currentImage, setCurrentImage] = useState(loadingImages[0])
  // const [fade, setFade] = useState(false)
  const [timedProgress, setTimedProgress] = useState(0)
  
  const startTimeRef = useRef(Date.now())
  const imageIndexRef = useRef(0)
  const imageKeys = Object.keys(loadingImages).map(Number).sort((a, b) => a - b)
  const hasCalledOnLoaded = useRef(false)

  useEffect(() => {
    let animationFrameId: number

    const safetyTimeout = setTimeout(() => {
      if (!hasCalledOnLoaded.current) {
        console.warn('Loading timeout, forcing completion')
        hasCalledOnLoaded.current = true
        setIsVisible(false)
        onLoaded()
      }
    }, 8000)

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min(100, (elapsed / TOTAL_LOADING_TIME) * 100)
      setTimedProgress(newProgress)
      
      const targetIndex = Math.min(
        Math.floor(newProgress / (100 / imageKeys.length)),
        imageKeys.length - 1
      )
      
      if (targetIndex > imageIndexRef.current) {
        // setFade(true)
        setTimeout(() => {
          imageIndexRef.current = targetIndex
          setCurrentImage(loadingImages[imageKeys[targetIndex] as keyof typeof loadingImages])
          // setFade(false)
        }, 200)
      }
      
      animationFrameId = requestAnimationFrame(updateProgress)
    }
    
    animationFrameId = requestAnimationFrame(updateProgress)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(safetyTimeout)
    }
  }, [])

  useEffect(() => {
    const realLoadingDone = progress >= 100//!active && progress >= 100
    const timedSequenceDone = timedProgress >= 100
    
    if (realLoadingDone && timedSequenceDone && !hasCalledOnLoaded.current) {
      hasCalledOnLoaded.current = true
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        onLoaded()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [active, progress, timedProgress, onLoaded])

  if (!isVisible) return null

  const displayProgress = Math.max(timedProgress, progress)

  return (
    <div className="fixed inset-0 bg-blue-50 z-50 flex items-center justify-center" style={{ fontFamily: "'gaegu', sans-serif" }}>
      <div className="text-black text-center w-100">
        <p className="text-4xl mb-6 non-selectable">Setting up the site...</p>

        <div className="relative non-selectable">
          <img
            src={currentImage}
            alt={`Loading ${Math.round(displayProgress)}%`}
            // className={`w-full h-full object-contain transition-opacity duration-300 cursor-pointer non-selectable ${
            //   fade ? 'opacity-0' : 'opacity-100'
            // }`}
            className={`w-full h-full object-contain transition-opacity duration-300 non-selectable}`}
          />
        </div>

        <p className="text-xl text-black mt-4 non-selectable">
          Use desktop for best experience
        </p>
      </div>
    </div>
  )
}
