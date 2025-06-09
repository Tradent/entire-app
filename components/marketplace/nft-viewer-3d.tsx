"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Text, Html } from "@react-three/drei"
import { Mesh, TextureLoader, type MeshStandardMaterial } from "three"
import { Loader2 } from "lucide-react"
import { MeasurementTools, type Measurement } from "@/components/marketplace/measurement-tools"

interface NFTViewer3DProps {
  modelUrl: string
  textureUrl?: string
  autoRotate?: boolean
  environment?: string
  lightIntensity?: number
  zoom?: number
  measurementMode?: boolean
  onMeasurementComplete?: (measurement: Measurement) => void
  measurements?: Measurement[]
  onDeleteMeasurement?: (id: string) => void
}

function Model({
  modelUrl,
  textureUrl,
  autoRotate = true,
  measurementMode = false,
  onMeasurementComplete,
  measurements = [],
  onDeleteMeasurement,
}: {
  modelUrl: string
  textureUrl?: string
  autoRotate?: boolean
  measurementMode?: boolean
  onMeasurementComplete?: (measurement: Measurement) => void
  measurements?: Measurement[]
  onDeleteMeasurement?: (id: string) => void
}) {
  const meshRef = useRef<Mesh>(null)
  const { scene } = useGLTF(modelUrl)

  // Apply texture if provided
  useEffect(() => {
    if (textureUrl) {
      const texture = new TextureLoader().load(textureUrl)
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          const material = child.material as MeshStandardMaterial
          if (material) {
            material.map = texture
            material.needsUpdate = true
          }
        }
      })
    }
  }, [scene, textureUrl])

  // Auto-rotate the model
  useFrame((_, delta) => {
    if (autoRotate && meshRef.current && !measurementMode) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <primitive ref={meshRef} object={scene} scale={2} position={[0, -1, 0]} />

      {/* Measurement tools */}
      {measurementMode && onMeasurementComplete && onDeleteMeasurement && (
        <MeasurementTools
          isActive={measurementMode}
          onMeasurementComplete={onMeasurementComplete}
          measurements={measurements}
          onDeleteMeasurement={onDeleteMeasurement}
        />
      )}
    </>
  )
}

function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.z = zoom
  }, [camera, zoom])

  return null
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 mb-2 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </Html>
  )
}

export default function NFTViewer3D({
  modelUrl,
  textureUrl,
  autoRotate = true,
  environment = "studio",
  lightIntensity = 1,
  zoom = 5,
  measurementMode = false,
  onMeasurementComplete,
  measurements = [],
  onDeleteMeasurement,
}: NFTViewer3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 0, zoom], fov: 50 }}>
      <CameraController zoom={zoom} />

      {/* Lighting */}
      <ambientLight intensity={lightIntensity * 0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={lightIntensity * 2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={lightIntensity} />

      {/* Environment */}
      <Environment preset={environment as any} />

      {/* 3D Model */}
      <Model
        modelUrl={modelUrl}
        textureUrl={textureUrl}
        autoRotate={autoRotate}
        measurementMode={measurementMode}
        onMeasurementComplete={onMeasurementComplete}
        measurements={measurements}
        onDeleteMeasurement={onDeleteMeasurement}
      />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={!measurementMode}
        minDistance={2}
        maxDistance={10}
      />

      {/* Watermark */}
      <Text
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="gray"
        anchorX="center"
        anchorY="middle"
      >
        ENTIRE
      </Text>
    </Canvas>
  )
}
