// components/Scene/Models/Book/Page.tsx
import { useCursor, useTexture } from "@react-three/drei"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useAtom } from "jotai"
import { easing } from "maath"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
  Group,
  Mesh,
  BufferGeometry,
  MeshBasicMaterial,
  Texture,
  Material,
} from "three"
import { degToRad } from "three/src/math/MathUtils.js"
import { pageAtom, type Hotspot } from "./pages"
import { useCamera } from "../../../../hooks/useCamera"

const easingFactor = 0.5
const easingFactorFold = 0.3
const insideCurveStrength = 0.179
const outsideCurveStrength = 0.02
const turningCurveStrength = 0.09

const PAGE_WIDTH = 1.28
const PAGE_HEIGHT = 1.71
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
)
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

const position = pageGeometry.attributes.position
const vertex = new Vector3()
const skinIndexes: number[] = []
const skinWeights: number[] = []

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i)
  const x = vertex.x
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4))
pageGeometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4))

const whiteColor = new Color("white")
// const emissiveColor = new Color("orange")

// const pageMaterials = [
//   new MeshBasicMaterial({ color: whiteColor }),
//   new MeshBasicMaterial({ color: "#111" }),
//   new MeshBasicMaterial({ color: whiteColor }),
//   new MeshBasicMaterial({ color: whiteColor }),
// ]

interface PageContent {
  front: string;
  back: string;
  hotspots?: Hotspot[];
  isAlternateView?: boolean;
  currentToggleId?: string;
}

interface PageProps {
  number: number
  front: string
  back: string
  page: number
  opened: boolean
  bookClosed: boolean
  hotspots?: Hotspot[]
  alternateContent?: PageContent;
  onContentReplace?: (pageNumber: number, newContent: PageContent) => void
}

interface HotspotMeshProps {
  hotspot: Hotspot;
  skeleton: Skeleton;
  boneIndex: number;
  pageNumber: number;
  // isOpened: boolean;
  side: 'front' | 'back';
  onHover: (hovering: boolean) => void;
  onClick: (hotspot: Hotspot) => void;
}

const usePageContent = (initialFront: string, initialBack: string, initialHotspots?: Hotspot[]) => {
  const [content, setContent] = useState<PageContent>({
    front: initialFront,
    back: initialBack,
    hotspots: initialHotspots,
    isAlternateView: false,
    currentToggleId: undefined
  });

  const toggleContent = useCallback((hotspot: Hotspot) => {
    if (!hotspot.toggleContent) {
        return;
        }
        
        setContent(current => {
        if (current.isAlternateView && current.currentToggleId === hotspot.name) {
            return {
            front: initialFront,
            back: initialBack,
            hotspots: initialHotspots,
            isAlternateView: false,
            currentToggleId: undefined
            };
        } else {
            return {
            ...hotspot.toggleContent!,
            isAlternateView: true,
            currentToggleId: hotspot.name
            };
        }
        });
    }, [initialFront, initialBack, initialHotspots]);

    const replaceContent = useCallback((newContent: PageContent) => {
        setContent(newContent);
    }, []);

    const resetContent = useCallback(() => {
        setContent({
        front: initialFront,
        back: initialBack,
        hotspots: initialHotspots,
        isAlternateView: false,
        currentToggleId: undefined
        });
    }, [initialFront, initialBack, initialHotspots]);

    return {
        content,
        toggleContent,
        replaceContent,
        resetContent
    };
};

const HotspotMesh: React.FC<HotspotMeshProps> = ({
  hotspot,
  skeleton,
  boneIndex,
  pageNumber,
  side,
  onHover,
  onClick,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage] = useAtom(pageAtom);
  useCursor(isHovered);

  const isActive = useMemo(() => {
    if (side === 'front') {
      return currentPage === pageNumber;
    } 
    else {
      return currentPage === pageNumber + 1;
    }
  }, [currentPage, pageNumber, side]);

  const getAdjustedZPosition = useCallback(() => {
    const baseZ = 0;
    if (side === 'front') {
      return baseZ + 0.05;
    } else {
      return baseZ - 0.05;
    }
  }, [side]);

  useEffect(() => {
    if (!skeleton || !meshRef.current) return;
    const bone = skeleton.bones[boneIndex];
    if (!bone) return;

    bone.add(meshRef.current);
    const adjustedZ = getAdjustedZPosition();
    
    meshRef.current.position.set(
      hotspot.position[0] % SEGMENT_WIDTH,
      hotspot.position[1],
      adjustedZ
    );

    meshRef.current.visible = isActive;
    
    // if (isActive) {
    //   console.log(`Hotspot Active: ${hotspot.name} on page ${pageNumber}, side ${side}, currentPage=${currentPage}`);
    // }
  }, [skeleton, boneIndex, hotspot.position, side, isActive, getAdjustedZPosition, hotspot.name, pageNumber, currentPage]);

  if (!isActive) return null;

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={(e) => {
        if (!isActive) return;
        e.stopPropagation();
        setIsHovered(true);
        onHover(true);
      }}
      onPointerLeave={(e) => {
        if (!isActive) return;
        e.stopPropagation();
        setIsHovered(false);
        onHover(false);
      }}
      onClick={(e) => {
        if (!isActive) return;
        e.stopPropagation();
        // console.log(`Hotspot Clicked: ${hotspot.name}`);
        onClick(hotspot);
      }}
    >
      <boxGeometry args={hotspot.size} />

      {/* DEBUG MESH */}
      {/* <meshBasicMaterial
        transparent
        opacity={0.3}
        color={hotspot.debugColor}
        wireframe={!!hotspot.debugColor}
      />  */}

      {/* INVISIBLE MESH */}
      <meshBasicMaterial
        transparent
        opacity={0}      // Fully invisible
        depthWrite={false} // Prevent writing to depth buffer
      /> 
    </mesh>
  );
};

export const Page: React.FC<PageProps> = ({ 
  number, 
  front, 
  back, 
  page, 
  opened, 
  bookClosed,
  hotspots: initialHotspots,
  ...props }) => {
  
  const { content, toggleContent } = usePageContent(
    front, 
    back, 
    initialHotspots, 
  );
  
  const textureUrls = useMemo(() => {
    const urls = new Set<string>();
    const visited = new Set<string>();
    
    urls.add(`/textures/book_webp/${front}.webp`);
    urls.add(`/textures/book_webp/${back}.webp`);
    // urls.add(`/textures/book/${front}.jpg`);
    // urls.add(`/textures/book/${back}.jpg`);
    
    const findAllToggleTextures = (hotspots: Hotspot[] = []) => {
      hotspots.forEach(hotspot => {
        const hotspotId = `${hotspot.name}-${hotspot.position.join(',')}`;
        
        if (visited.has(hotspotId)) {
          return;
        }
        
        visited.add(hotspotId);
        
        if (hotspot.toggleContent) {
          // urls.add(`/textures/book/${hotspot.toggleContent.front}.jpg`);
          // urls.add(`/textures/book/${hotspot.toggleContent.back}.jpg`);
          urls.add(`/textures/book_webp/${hotspot.toggleContent.front}.webp`);
          urls.add(`/textures/book_webp/${hotspot.toggleContent.back}.webp`);
          if (hotspot.toggleContent.hotspots) {
            findAllToggleTextures(hotspot.toggleContent.hotspots);
          }
        }
      });
    };
    
    findAllToggleTextures(initialHotspots);
    
    // console.log("preloaded textures:", Array.from(urls).map(url => url.split('/').pop()));
    
    return Array.from(urls);
  }, [front, back, initialHotspots]);

    const textures = useTexture(textureUrls) as Texture[];

    useMemo(() => {
        textures.forEach(tex => {
        if (tex) {
            tex.colorSpace = SRGBColorSpace;
            tex.needsUpdate = true;
        }
        });
  }, [textures]);


    const getCurrentTexture = useCallback((textureName: string) => {
        return textures.find(tex => tex?.image?.src?.includes(textureName)) || textures[0];
    }, [textures]);

  const picture = getCurrentTexture(content.front);
  const picture2 = getCurrentTexture(content.back);
  
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  
  const { currentView } = useCamera()
  // const [picture, picture2] = textures
  // picture.colorSpace = picture2.colorSpace = SRGBColorSpace

  const group = useRef<Group>(null)
  const turnedAt = useRef(0)
  const lastOpened = useRef(opened)
  const skinnedMeshRef = useRef<SkinnedMesh<BufferGeometry, Material[]>>(null);
  const [, setPage] = useAtom(pageAtom)
  // const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const lastContentChange = useRef(Date.now());

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    if (Date.now() - lastContentChange.current < 300) return;
    
    if (hotspot.isToggle && hotspot.toggleContent) {
        lastContentChange.current = Date.now();
        toggleContent(hotspot);
    } else if (hotspot.actionType === 'navigate') {
        hotspot.onClick(setPage);
    } else if (hotspot.actionType === 'link') {
        hotspot.onClick(setPage);
    } else {
        hotspot.onClick(setPage);
    }
  }, [toggleContent, setPage]);

  const manualSkinnedMesh = useMemo(() => {
    const bones: Bone[] = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone()
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH
      if (i > 0) bones[i - 1].add(bone)
      bones.push(bone)
    }

    const skeleton = new Skeleton(bones)
    
      const materials = [
        new MeshBasicMaterial({ color: whiteColor }),
        new MeshBasicMaterial({ color: "#111" }),
        new MeshBasicMaterial({ color: whiteColor }),
        new MeshBasicMaterial({ color: whiteColor }),
        new MeshBasicMaterial({
          color: whiteColor,
          map: picture,
          transparent: true,
          alphaTest: 0.1,
        }),
        new MeshBasicMaterial({
          color: whiteColor,
          map: picture2,
          transparent: true,
          alphaTest: 0.1,
        }),
      ];

      const mesh = new SkinnedMesh(pageGeometry, materials);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      mesh.add(skeleton.bones[0]);
      mesh.bind(skeleton);
      return mesh;
  
  }, [])
  // picture, picture2

  useEffect(() => {
    if (!skinnedMeshRef.current) return;
    if (front === 'cover_6' || back === 'back_final') {
      const mesh = skinnedMeshRef.current;
      mesh.material = [
        new MeshStandardMaterial({ color: whiteColor, emissive: new Color(0x000000) }),
        new MeshStandardMaterial({ color: "#111", emissive: new Color(0x000000) }),
        new MeshStandardMaterial({ color: whiteColor, emissive: new Color(0x000000) }),
        new MeshStandardMaterial({ color: whiteColor, emissive: new Color(0x000000) }),
        new MeshStandardMaterial({
          color: whiteColor,
          map: picture,
          transparent: true,
          alphaTest: 0.1,
          emissive: new Color("gray"),
          emissiveIntensity: 0,
        }),
        new MeshStandardMaterial({
          color: whiteColor,
          map: picture2,
          transparent: true,
          alphaTest: 0.1,
          emissive: new Color("gray"),
          emissiveIntensity: 0,
        }),
      ];
    } else {
      const mesh = skinnedMeshRef.current;

      mesh.material = [
        new MeshStandardMaterial({ color: whiteColor }),
        new MeshStandardMaterial({ color: "#111" }),
        new MeshStandardMaterial({ color: whiteColor }),
        new MeshStandardMaterial({ color: whiteColor }),
        new MeshStandardMaterial({
          color: whiteColor,
          map: picture,
          transparent: true,
          alphaTest: 0.1,
        }),
        new MeshStandardMaterial({
          color: whiteColor,
          map: picture2,
          transparent: true,
          alphaTest: 0.1,
        }),
      ];
    }

  }, [currentView, picture, picture2, number])

  const [highlighted, setHighlighted] = useState(false)
  // const [hoverTurn, setHoverTurn] = useState(0);
  useCursor(highlighted)

  useFrame((_, delta) => {
    const mesh = skinnedMeshRef.current
    if (!mesh) return

    const timeSinceContentChange = Date.now() - lastContentChange.current;
    if (timeSinceContentChange < 100) {
      return;
    }

    const emissiveIntensity = highlighted ? 0.12 : 0
    if (mesh.material[4] instanceof MeshStandardMaterial) {
      mesh.material[4].emissiveIntensity = MathUtils.lerp(
        mesh.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      )
    }
    if (mesh.material[5] instanceof MeshStandardMaterial) {
      mesh.material[5].emissiveIntensity = MathUtils.lerp(
        mesh.material[5].emissiveIntensity,
        emissiveIntensity,
        0.1
      )
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = Date.now()
      lastOpened.current = opened
    }

    let turningTime = Math.min(400, Date.now() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)
    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
    if (!bookClosed) targetRotation += degToRad(number * 0.3)

    const bones = mesh.skeleton.bones
    bones.forEach((bone, i) => {
      const target = i === 0 ? group.current : bone
      if (!target) return

      // const hoverInfluence =
      // hoverTurn * Math.max(0, (i - (PAGE_SEGMENTS -28)) / 28); 
      // const deg = hoverSide === "left" ? 0.0 : -0.1;
      // const hoverAngle = degToRad(deg) * hoverInfluence; 
      // bone.rotation.y += hoverAngle;

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 1.45) : 0
      const outsideCurveIntensity = i >= 12 ? Math.cos(i * 0.3 + 0.2) : 0
      const turningIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime
      let rotationAngle = 
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2)
      if (bookClosed) {
        rotationAngle = i === 0 ? targetRotation : 0
        foldRotationAngle = 0
      }
      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta)
      const foldIntensity =
        i > 8 ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0
      easing.dampAngle(target.rotation, "x", foldRotationAngle * foldIntensity, easingFactorFold, delta)
    })
  })

  const isEdgeHit = (e: ThreeEvent<MouseEvent>) => {
    const face = e.face;
    if (!face) return false;

    const vertexIndex = face.a;
    const boneIndex = pageGeometry.attributes.skinIndex.getX(vertexIndex);

    const isEdge = boneIndex >= PAGE_SEGMENTS - 4;

    return isEdge
  };
  // const getEdgeHitSide = (e: ThreeEvent<MouseEvent>): "left" | "right" | null => {
  //   const face = e.face;
  //   if (!face) return null;

  //   const vertexIndex = face.a;
  //   const boneIndex = pageGeometry.attributes.skinIndex.getX(vertexIndex);

  //   const isEdge = boneIndex >= PAGE_SEGMENTS - 4;
  //   if (!isEdge) return null;

  //   const x = e.point.x;
  //   // console.log("X:, Y", x, e.point.y)

  //   return x < 1 ? "left" : "right";
  // };

  return (
    <group
      {...props}
      ref={group}
      onPointerMove={(e) => {
        if (currentView !== "book") return;
        e.stopPropagation();
        if (isEdgeHit(e)) {
          setHighlighted(true);
          // setHoverTurn(1);
        } else {
          setHighlighted(false);
          // setHoverTurn(0);
        }
      }}
      // onPointerMove={(e) => {
      //   if (currentView !== "book") return;
      //   e.stopPropagation();

      //   const side = getEdgeHitSide(e);

      //   if (side) {
      //     setHighlighted(true);
      //     setHoverTurn(1);
      //     setHoverSide(side);
      //   } else {
      //     setHighlighted(false);
      //     setHoverTurn(0);
      //     setHoverSide(null);
      //   }
      // }}

      onPointerLeave={(e) => {
        if (currentView !== "book") return;
        e.stopPropagation();
        setHighlighted(false);
        // setHoverTurn(0);
      }}
      onClick={(e) => {
        if (currentView !== "book") return;
        e.stopPropagation();
        if (isEdgeHit(e)) {
          setPage(opened ? number : number + 1);
          setHighlighted(false);
        }
      }}
      // onClick={(e) => {
      //   if (currentView !== "book") return;
      //   e.stopPropagation();

      //   const side = getEdgeHitSide(e);
      //   if (!side) return;

      //   setPage((prev) => (side === "right" ? prev + 1 : Math.max(prev - 1, 0)));
      //   setHighlighted(false);
      // }}


    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />

      {skinnedMeshRef.current?.skeleton &&
        content.hotspots?.map((hotspot: Hotspot, i: number) => {
          const boneIndex = Math.floor((hotspot.position[0] + PAGE_WIDTH / 2) / SEGMENT_WIDTH);
          const clampedBoneIndex = Math.min(Math.max(boneIndex, 0), PAGE_SEGMENTS - 1);

          return (
            <HotspotMesh
              key={i}
              hotspot={hotspot}
              skeleton={skinnedMeshRef.current!.skeleton}
              boneIndex={clampedBoneIndex}
              pageNumber={number}
              side={hotspot.side || 'front'}
              onHover={() => {}}
              onClick={handleHotspotClick}
            />
          )
      })}
    </group>
  )
}
