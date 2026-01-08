// components/Scene/Models/Headphones.tsx
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useCamera } from '../../../../hooks/useCamera'
import type { GLTF } from 'three-stdlib'

interface HeadphonesProps {
  model: GLTF | null,
  position?: [number, number, number],
  rotation?: [number, number, number]
}

export function Headphones({ model, position = [0, 0, 0], rotation = [0, Math.PI * -0.1, 0]}: HeadphonesProps) {
  const { moveToHeadphoneView, moveToFrontView, currentView } = useCamera()
  const headphoneRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)


  const scene = useMemo(() => {
    if (!model) return null
    return model.scene.clone(true)
  }, [model])

  useFrame(() => {
    if (headphoneRef.current && hovered) {
      headphoneRef.current.scale.lerp(new THREE.Vector3(1.04, 1, 1.04), 0.1)
    } else if (headphoneRef.current) {
      headphoneRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  const handleClick = () => {
    if (currentView !== "headphone") {
      moveToHeadphoneView()
    } else {
      moveToFrontView()
    }
  }

  const handlePointerEnter = () => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  if (!scene) return null

  return (
    <group 
      ref={headphoneRef} 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      >
      <primitive 
        object={scene} 
        scale={0.8}
        rotation={[0, Math.PI * 0.4, 0]}
      />
    </group>
  )
}
