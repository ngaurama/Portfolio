// components/Scene/DeskScene.tsx
import { useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { Desk } from './Models/Desk'
import { Laptop } from './Models/Laptop/Laptop'
import { Headphones } from './Models/Headphones/Headphones'
import { Lamp } from './Models/Lamp'
import { Chair } from './Models/Chair'
import { Pen } from './Models/Pen'
import { CameraRig } from './CameraRig'
import { DevControls } from './DevControls'
import { useCamera } from '../../hooks/useCamera'
import * as THREE from 'three'
import { Book } from './Models/Book/Book'
import { MusicWidget } from './Models/Headphones/MusicWidget'
// import { useButtonInteractions } from '../../hooks/useButtonInteractions'
import { useModels } from '../../hooks/useModels'

interface DeskSceneProps {
  onLoaded: () => void
  lampColor: string
  setLampColor: (v: string) => void
  setColorPickerOpen: (v: boolean) => void
  colorPickerOpen: boolean
}

export function DeskScene({ onLoaded, lampColor, setLampColor, setColorPickerOpen, colorPickerOpen }: DeskSceneProps) {
  const { models, isLoading: modelsLoading } = useModels()
  // const [showMusicWidget, setShowMusicWidget] = useState(false);
  const { currentView } = useCamera()
  const devMode = false

  
  // useButtonInteractions()

  useEffect(() => {
    if (!modelsLoading) {
      onLoaded()
    }
  }, [modelsLoading, onLoaded])

  if (modelsLoading) {
    return null
  }

  return (
    <>
      {devMode ? (
        <DevControls enabled={true} />
      ) : (
        <CameraRig />
      )}
      
      {/* <Environment preset="night" background={false} backgroundBlurriness={0} resolution={16} /> */}
      <mesh scale={50}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={lampColor} side={THREE.BackSide} transparent opacity={0.5} />
      </mesh>


      {/* <color attach="background" args={[lampColor]} /> */}
      {/* <hemisphereLight
        skyColor={lampColor}
        groundColor="#222"
        intensity={0.6}
      />
      <directionalLight
        color={lampColor}
        position={[5, 10, 5]}
        intensity={0.4}
      /> */}

      
      {/* <Desk position={[0, -1.25, 0]} />
      <Chair position={[1, -1.5, 2.5]} />
      <Laptop position={[0, 2.5, -0.5]} rotation={[0, Math.PI * 0.08, 0]} />
      <Headphones 
        position={[-2.3, -1.25, 3]} 
        rotation={[0, 0, 0]}      
      />
      <Pen position={[2.5, 2.45, -0.5]} rotation={[0, 0, 0]} /> */}
      {/* <Lamp
        position={[3.2, 2.4, -1.7]}
        lampColor={lampColor}
        setLampColor={setLampColor}
        setColorPickerOpen={setColorPickerOpen}
        colorPickerOpen={colorPickerOpen}
      />

      <group visible={currentView === 'headphone'}>
        <MusicWidget position={[-3, 2.8, 0]} />
      </group> */}
      {/* 
      {currentView === 'headphone' && (
        <MusicWidget position={[-3, 2.8, 0]} />
      )} */}

      <Book position={[1.3, 2.47, 0.6]} rotation={[0, -0.8, 1.54]}/> 
      <Desk model={models.desk} position={[0, -1.25, 0]} />
      <Chair model={models.chair} position={[1, -1.5, 2.5]} />
      <Laptop model={models.laptop} position={[0, 2.5, -0.5]} rotation={[0, Math.PI * 0.08, 0]} />
      <Headphones model={models.headphones} position={[-2.3, -1.25, 3]}  rotation={[0, 0, 0]} />
      <Pen model={models.pen} position={[2.5, 2.45, -0.5]} />
      <Lamp
        model={models.lamp}
        position={[3.2, 2.4, -1.7]}
        lampColor={lampColor}
        setLampColor={setLampColor}
        setColorPickerOpen={setColorPickerOpen}
        colorPickerOpen={colorPickerOpen}
      />

      <MusicWidget
        model={models.music_widget}
        active={currentView === 'headphone'}
        position={[-3, 2.8, 0]}
      />


      <CarpetPlane />
    </>
  )
}

function CarpetPlane() {
  const [
    colorMap,
    normalMap,
    // roughnessMap,
    // aoMap,
    // displacementMap
  ] = useTexture([
    '/textures/floor_textures/Floor_Color.webp',
    '/textures/floor_textures/Floor_NormalGL.webp',
    // '/textures/floor_textures_purple/Floor_Roughness.jpg',
    // '/textures/floor_textures_purple/Floor_AmbientOcclusion.jpg',
    // '/textures/floor_textures_purple/Floor_Displacement.jpg'
  ])

  colorMap.wrapS = colorMap.wrapT =
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  // roughnessMap.wrapS = roughnessMap.wrapT =
  // aoMap.wrapS = aoMap.wrapT =
  // displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping

  colorMap.repeat.set(4, 4)
  normalMap.repeat.set(4, 4)
  // roughnessMap.repeat.set(4, 4)
  // aoMap.repeat.set(4, 4)
  // displacementMap.repeat.set(4, 4)
  useEffect(() => {
    [colorMap, normalMap].forEach(texture => {
      texture.anisotropy = 4
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
    })
  }, [colorMap, normalMap])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      {/* <planeGeometry args={[10, 10, 256, 256]} /> */}
      <planeGeometry args={[10, 10, 16, 16]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
      />

      {/* <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        displacementMap={displacementMap}
        displacementScale={0.1}
        roughness={1}
        metalness={0}
      /> */}
    </mesh>
  )
}
