// App.tsx
import { Canvas } from '@react-three/fiber'
import { DeskScene } from './components/Scene/DeskScene'
import { useScrollNavigation } from './hooks/useScrollNavigation'
import { useEffect, useRef, useState } from 'react'
import { useCamera } from './hooks/useCamera'
import Header from './components/UI/Header'
import Footer from './components/UI/Footer'
import { HexColorPicker } from 'react-colorful'
// import { Perf } from 'r3f-perf'
import { useAtom } from 'jotai'
import { pageAtom } from './components/Scene/Models/Book/pages'
import { VideoModal } from './components/Scene/Models/Book/VideoModal'
import { LoadingScreen } from './components/UI/LoadingScreen'
import Doodles from './components/UI/Doodles'
import { helpActiveAtom } from "./atoms/helpAtom";

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const { moveToBookView } = useCamera()
  const lampRef = useRef<HTMLDivElement>(null)
  const [lampColor, setLampColor] = useState("#ffffff")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [, setPage] = useAtom(pageAtom)
  const [helpActive] = useAtom(helpActiveAtom);
  
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  })

  useScrollNavigation()

  const openVideoModal = (videoUrl: string, title?: string) => {
    setVideoModal({
      isOpen: true,
      videoUrl,
      title: title || 'Video'
    })
  }

  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      videoUrl: '',
      title: ''
    })
  }

  useEffect(() => {
    window.openVideoModal = openVideoModal;
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const restorePage = urlParams.get('restorePage');
    
    if (restorePage) {
      moveToBookView();
      const pageNumber = parseInt(restorePage);

      setPage(pageNumber);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [setPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lampRef.current && !lampRef.current.contains(event.target as Node)) {
        setColorPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //   navigator.userAgent
  // ) || window.innerWidth < 768;
  const isMobile = window.innerWidth < 768;  

  const handleSceneLoaded = () => {
    setIsLoading(false)
  }

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
  }

  useEffect(() => {
  }, [isLoading, showLoadingScreen])

  return (
    <div className="w-full h-screen bg-blue-200 overflow-hidden">
      {!helpActive && <Header />}     
      {!helpActive && !isMobile && <Doodles />}     
      {showLoadingScreen && (
        <LoadingScreen onLoaded={handleLoadingComplete} />
        // <LoadingScreen 
        //   isLoaded={!isLoading} 
        //   onAnimationComplete={handleLoadingComplete}
        // />
      )}
      
      <VideoModal
        videoUrl={videoModal.videoUrl}
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        title={videoModal.title}
      />
      
      {colorPickerOpen && (
        <div
          ref={lampRef}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "12px",
            background: "rgba(20,20,20,0.85)",
            backdropFilter: "blur(6px)",
            borderRadius: "12px",
            zIndex: 9999
          }}
        >
          <HexColorPicker
            color={lampColor}
            onChange={(color) => setLampColor(color)}
          />

          <button
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "6px",
              borderRadius: "8px",
              background: "#444",
              color: "white",
              cursor: "pointer"
            }}
            onClick={() => setColorPickerOpen(false)}
          >
            Close
          </button>
        </div>
      )}
      <Canvas
        frameloop="demand"
        performance={{ min: 0.5 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{
          position: [0, 0, 0],
          fov: isMobile ? 85 : 50,
        }}
        shadows
      >
        {/* <Perf /> */}
        <DeskScene 
          onLoaded={handleSceneLoaded}
          lampColor={lampColor}
          setLampColor={setLampColor}
          setColorPickerOpen={setColorPickerOpen}
          colorPickerOpen={colorPickerOpen}
        />
      </Canvas>
  {/* 
      {!showLoadingScreen && currentView === 'side' && (
        <>
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            Scroll to explore
          </div>
        </>
      )} */}
      <Footer />
    </div>
  )
}

export default App
