// components/Scene/Models/Pen.tsx
import { useMemo, useRef } from 'react'
// import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

interface PenProps {
  model: GLTF | null
  position?: [number, number, number],
  rotation?: [number, number, number]
}

export function Pen({ model, position = [0, 0, 0], rotation = [0, Math.PI * -0.1, 0]}: PenProps) {
  const penRef = useRef<THREE.Group>(null)

  const scene = useMemo(() => {
    if (!model) return null
    return model.scene.clone(true)
  }, [model])

  if (!scene) return null

  return (
    <group ref={penRef} position={position} rotation={rotation}>
      <primitive 
        object={scene} 
        scale={0.0023}
        rotation={[Math.PI / 2, Math.PI, Math.PI / 2.8]}
      />
    </group>
  )
}
