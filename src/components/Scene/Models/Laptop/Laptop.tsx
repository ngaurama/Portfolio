// components/Scene/Models/Laptop.tsx
import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ScreenManager } from './ScreenManager'
import { useCamera } from '../../../../hooks/useCamera'
import type { GLTF } from 'three-stdlib'

interface LaptopProps {
  model: GLTF | null,
  position?: [number, number, number],
  rotation?: [number, number, number]
}

export function Laptop({ model, position = [0, 0, 0.3], rotation = [0, Math.PI * -0.1, 0] }: LaptopProps) {
  const { moveToLaptopView, moveToFrontView, currentView } = useCamera()
  const laptopRef = useRef<THREE.Group>(null)
  const [screenMesh, setScreenMesh] = useState<THREE.Mesh | null>(null)
  const [hovered, setHovered] = useState(false)
  // const [clicked, setClicked] = useState(false)

  const scene = useMemo(() => {
    if (!model) return null
    return model.scene.clone(true)
  }, [model])

  useEffect(() => {
    if (!scene) return

    
    const findScreenMesh = (object: THREE.Object3D): THREE.Mesh | null => {
      if (object instanceof THREE.Mesh && object.name === 'Screen')
        return object
      for (const child of object.children) {
        const result = findScreenMesh(child)
        if (result) return result
      }
      
      return null
    }

    const screen = findScreenMesh(scene)
    if (screen) {
      setScreenMesh(screen)
    }
  }, [scene])

  useFrame(() => {
    if (laptopRef.current && hovered) {
      laptopRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1)
    } else if (laptopRef.current) {
      laptopRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  const handleClick = () => {
    if (currentView !== "laptop") {
      moveToLaptopView()
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
      ref={laptopRef} 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <primitive 
        object={scene} 
        scale={1}
      />
      {screenMesh && (
        <>
            <ScreenManager 
            screenMesh={screenMesh} 
            isPoweredOn={true}
            />
        </>
      )}
    </group>
  )
}
