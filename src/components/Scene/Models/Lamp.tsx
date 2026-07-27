import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useCamera } from '../../../hooks/useCamera'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import type { GLTF } from 'three-stdlib'
// import { Environment } from '@react-three/drei'

const HOVER_SCALE = new THREE.Vector3(1.02, 1.02, 1.02)
const IDLE_SCALE = new THREE.Vector3(1, 1, 1)

interface LampProps {
  model: GLTF | null
  position?: [number, number, number]
  lampColor: string
  setLampColor: (color: string) => void
  setColorPickerOpen: (v: boolean) => void
  colorPickerOpen: boolean
}

export function Lamp({ model, position = [0, 0, 0], lampColor, setColorPickerOpen, colorPickerOpen }: LampProps) {
  const lampRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.SpotLight>(null)
  const { currentView } = useCamera()
  const { invalidate } = useThree()
  const [hovered, setHovered] = useState(false)

  const scene = useMemo(() => {
    if (!model) return null
    return model.scene.clone(true)
  }, [model])

  useFrame(() => {
    if (!lampRef.current) return
    const target = hovered && currentView !== 'book' ? HOVER_SCALE : IDLE_SCALE
    lampRef.current.scale.lerp(target, 0.1)
    if (lampRef.current.scale.distanceTo(target) > 0.001) invalidate()
  })

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

  // const handleClick = (event: Event) => {
  //   if (currentView !== "front") {
  //     event.stopPropagation()
  //     moveToFrontView()
  //   } else {
  //     moveToSideView()
  //   }
  // }
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setColorPickerOpen(!colorPickerOpen)
  }

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.toLowerCase().includes("bulb")) {
          const material = child.material as THREE.MeshStandardMaterial
          material.emissive = new THREE.Color(lampColor)
          material.emissiveIntensity = 5
        }
      }
    })
  }, [lampColor, scene])


  if (!scene) return null

  let spotIntense = 15
  if (currentView === 'book')
    spotIntense = 15
  else
    spotIntense = 15

  // let ambIntense = 0
  // if (currentView === 'book')
  //   ambIntense = 0
  // else
  //   ambIntense = 0
  return (
    <group 
      ref={lampRef} 
      position={position}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      >
      {/* Lamp model */}
      <primitive 
        object={scene} 
        scale={0.7}
        rotation={[0, Math.PI * 1.1, 0]}
      />

      {/* Spot light attached to the lamp */}

      {/* <ambientLight intensity={1.5} /> */}

        <spotLight
            ref={lightRef}
            position={[-3, 4, -1]}       // right above lamp bulb
            angle={Math.PI / 2}        // narrower beam
            penumbra={0.2}
            intensity={spotIntense}             // high intensity needed for indoor scenes
            color={lampColor}
            decay={0.8}                   // physically correct falloff
            distance={100}           // max range of light
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
        />
    </group>
  )
}
