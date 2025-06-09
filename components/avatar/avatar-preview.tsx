"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AvatarPreviewProps {
  selectedNFTs: Record<string, number | null>
  userNFTs: Record<string, any[]>
  avatarCustomization: {
    bodyType: string
    skinTone: string
    hairStyle: string
    hairColor: string
  }
}

function AvatarModel({ selectedNFTs, userNFTs, avatarCustomization }: AvatarPreviewProps) {
  // In a real implementation, we would load the actual 3D models for each NFT
  // For this demo, we'll use a placeholder model and show HTML overlays
  const { scene } = useGLTF("/assets/3d/duck.glb")

  // Get the selected NFT names for display
  const selectedNFTNames: Record<string, string> = {}
  Object.entries(selectedNFTs).forEach(([category, id]) => {
    if (id !== null) {
      const nft = userNFTs[category].find((item) => item.id === id)
      if (nft) {
        selectedNFTNames[category] = nft.name
      }
    }
  })

  return (
    <>
      <primitive object={scene.clone()} scale={2} position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]} />

      <Html position={[0, 2, 0]} center>
        <div className="px-4 py-2 text-sm text-center text-white bg-black/70 rounded-lg whitespace-nowrap">
          Avatar: {avatarCustomization.bodyType.toUpperCase()} Type
        </div>
      </Html>

      {/* Display NFT labels */}
      {Object.entries(selectedNFTNames).map(([category, name], index) => (
        <Html key={category} position={[0, 1 - index * 0.5, 0]} center>
          <div className="px-3 py-1 text-xs text-white bg-primary/80 rounded-full whitespace-nowrap">
            {category}: {name}
          </div>
        </Html>
      ))}
    </>
  )
}

export default function AvatarPreview({ selectedNFTs, userNFTs, avatarCustomization }: AvatarPreviewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 mb-2 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading avatar...</p>
            </div>
          </Html>
        }
      >
        <AvatarModel selectedNFTs={selectedNFTs} userNFTs={userNFTs} avatarCustomization={avatarCustomization} />
        <Environment preset="apartment" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
