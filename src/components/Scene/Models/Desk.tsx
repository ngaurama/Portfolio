import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { HelpText3D } from './HelpText'
import { useAtom } from 'jotai'
import { helpActiveAtom } from '../../../atoms/helpAtom'
import { useCamera } from '../../../hooks/useCamera'
import type { GLTF } from 'three-stdlib'

interface DeskProps {
  model: GLTF | null
  position?: [number, number, number]
}

export function Desk({ model, position = [0, 0, 0] }: DeskProps) {
  const deskRef = useRef<THREE.Group>(null)
  const { currentView } = useCamera()
  const [helpActive, setHelpActive] = useAtom(helpActiveAtom)
  const [visible, setVisible] = useState(helpActive)

  const scene = useMemo(() => {
    if (!model) return null
    return model.scene.clone(true)
  }, [model])

  useEffect(() => {
    if (helpActive && currentView === 'side') {
      setVisible(true)
    } else if (visible) {
      if (currentView !== 'side') {
        const timer = setTimeout(() => {
          setVisible(false)
          setHelpActive(false)
        }, 1500)
        return () => clearTimeout(timer)
      } else {
        setVisible(false)
        setHelpActive(false)
      }
    }
  }, [helpActive, currentView, visible, setHelpActive])

  if (!scene) return null

  const isMobile = window.innerWidth < 768

  return (
    <group ref={deskRef} position={position}>
      <primitive
        object={scene}
        scale={0.4}
        rotation={[0, Math.PI * 0.5, 0]}
      />

      {visible && (
        <>
          <HelpText3D
            position={[3, 4.8, 1.2]}
            rotation={[0, -Math.PI * 0.51, 0]}
            text="Click on the book to view main portfolio content."
            fontSize={0.35}
            maxWidth={2.8}
            fadeOut={currentView !== 'side'}
          />

          <HelpText3D
            position={[-0.5, 5.6, -3]}
            rotation={[0.12, 0.1, 0.05]}
            text="Click on laptop to interact with the terminal."
            fontSize={0.35}
            maxWidth={3}
            fadeOut={currentView !== 'side'}
          />

          <HelpText3D
            position={[3, 5.75, -1.1]}
            rotation={[0, -0.8, 0]}
            text="Click     on the lamp to        change the lighting   color"
            fontSize={0.25}
            maxWidth={2.3}
            fadeOut={currentView !== 'side'}
          />

          <HelpText3D
            position={[-2.5, 3.8, 1.5]}
            rotation={[-1.5, 0, 0]}
            color="black"
            text="Click on the headphones for music."
            fontSize={0.25}
            maxWidth={2.2}
            fadeOut={currentView !== 'side'}
          />

          <HelpText3D
            position={!isMobile ? [-2.8, 4.18, 3] : [-3, 4.18, 3]}
            rotation={[0, 0, 0.01]}
            color="white"
            text={!isMobile ? 'Scroll/click to change views' : 'Click to change views'}
            fontSize={0.23}
            maxWidth={5}
            fadeOut={currentView !== 'side'}
          />
        </>
      )}
    </group>
  )
}
