// components/Scene/Models/Book/Book.tsx
import { useAtom } from "jotai"
import { pageAtom, pages } from "./pages"
import { Page } from "./Page"
import { useRef, useState } from "react"
import * as THREE from "three"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { useCamera } from "../../../../hooks/useCamera"

const HOVER_SCALE = new THREE.Vector3(1.07, 1.07, 1.07)
const IDLE_SCALE = new THREE.Vector3(1, 1, 1)

interface BookProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Book({ position = [0, 0, 0], rotation = [0, 0, 0] }: BookProps) {
  const [page] = useAtom(pageAtom)
  const { moveToBookView, currentView } = useCamera()
  const { invalidate } = useThree()
  const bookRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (currentView !== 'book') {
      event.stopPropagation()
      moveToBookView()
    }
  }

  const handlePointerEnter = () => {
    if (currentView !== 'book') {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerLeave = () => {
    if (currentView !== 'book') {
      setHovered(false)
      document.body.style.cursor = 'default'
    }
  }

  useFrame(() => {
    if (!bookRef.current) return
    const target = hovered && currentView !== 'book' ? HOVER_SCALE : IDLE_SCALE
    bookRef.current.scale.lerp(target, 0.1)
    if (bookRef.current.scale.distanceTo(target) > 0.001) invalidate()
  })

  return (
    <group 
      ref={bookRef} 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {pages.map((pageData, index) => (
        <Page
          key={index}
          page={page}
          number={index}
          opened={page > index}
          bookClosed={page === 0 || page === pages.length}
          hotspots={pageData.hotspots || []}
          front={pageData.front}
          back={pageData.back}
          // alternateContent={pageData.alternateContent}
        />
      ))}
    </group>
  )
}
