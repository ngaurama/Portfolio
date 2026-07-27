// components/Scene/CameraRig.tsx
// import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useCamera } from '../../hooks/useCamera'
import * as THREE from 'three'

// const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     navigator.userAgent
//   ) || window.innerWidth < 768;
const isMobile = window.innerWidth < 768;  
let bookY = 4.54
if (isMobile)
  bookY = 5.7
//  laptop: new THREE.Vector3(0.25, 3.5, 1),
const CAMERA_POSITIONS = {
  side: new THREE.Vector3(-6, 6, 6),
  front: new THREE.Vector3(0, 6, 5),
  laptop: new THREE.Vector3(0.25, 3.5, 1),
  book: new THREE.Vector3(1.5, bookY, 0.84),
  headphone: new THREE.Vector3(0.5, 3.3, 2.6)
}

const CAMERA_LOOK_AT = {
  side: new THREE.Vector3(-0.5, 2, 0),
  front: new THREE.Vector3(0, 2.5, 0),
  laptop: new THREE.Vector3(0, 3.5, 0),
  book: new THREE.Vector3(0.4, -7.5, -0.3),
  headphone: new THREE.Vector3(-2, 3, 0)
}

// const x1 = 2.
// const y1 = 4
// const z1 = 1.5

// const x2 = 0.5
// const y2 = -3.5
// const z2 = 0
// const CAMERA_POSITIONS = {
//   side: new THREE.Vector3(-6.5, 6, 6),
//   front: new THREE.Vector3(0, 6, 5),
//   laptop: new THREE.Vector3(0.25, 3.5, 1),
//   book: new THREE.Vector3(x1, y1, z1)
// }

// const CAMERA_LOOK_AT = {
//   side: new THREE.Vector3(0, 2, 0),
//   front: new THREE.Vector3(0, 2.5, 0),
//   laptop: new THREE.Vector3(0, 3.5, 0),
//   book: new THREE.Vector3(x2, y2, z2)
// }

export function CameraRig() {
  const { camera, invalidate } = useThree()
  const { currentView } = useCamera()
  // const cameraRef = useRef<THREE.Camera>(camera)

  useFrame((_state, delta) => {
    const targetPosition = CAMERA_POSITIONS[currentView]
    const targetLookAt = CAMERA_LOOK_AT[currentView]

    const lerpSpeed = 2
    camera.position.lerp(targetPosition, delta * lerpSpeed)


    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    currentLookAt.add(camera.position)

    const newLookAt = new THREE.Vector3()
    newLookAt.lerpVectors(currentLookAt, targetLookAt, delta * 2)

    camera.lookAt(newLookAt)

    if (camera.position.distanceTo(targetPosition) > 0.001) invalidate()
  })

  return null
}
