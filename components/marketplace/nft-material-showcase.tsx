"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useTexture } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NFTMaterialShowcaseProps {
  materials: {
    name: string
    texture: string
    description: string
    properties: {
      reflectivity?: number
      roughness?: number
      metalness?: number
      emissive?: boolean
    }
  }[]
}

function MaterialSphere({
  texture,
  properties,
}: {
  texture: string
  properties: {
    reflectivity?: number
    roughness?: number
    metalness?: number
    emissive?: boolean
  }
}) {
  const textureMap = useTexture(texture)

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={textureMap}
        roughness={properties.roughness ?? 0.5}
        metalness={properties.metalness ?? 0.5}
        emissive={properties.emissive ? textureMap : null}
        emissiveIntensity={properties.emissive ? 0.5 : 0}
      />
    </mesh>
  )
}

export default function NFTMaterialShowcase({ materials }: NFTMaterialShowcaseProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Showcase</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="0" onValueChange={(value) => setSelectedMaterial(Number.parseInt(value))}>
          <TabsList className="w-full justify-start px-6 pt-2">
            {materials.map((material, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                {material.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {materials.map((material, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-0">
              <div className="grid md:grid-cols-2">
                <div className="aspect-square">
                  <Canvas camera={{ position: [0, 0, 3] }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <MaterialSphere texture={material.texture} properties={material.properties} />
                    <Environment preset="studio" />
                    <OrbitControls enablePan={false} />
                  </Canvas>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">{material.name}</h3>
                  <p className="text-muted-foreground mb-4">{material.description}</p>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {material.properties.reflectivity !== undefined && (
                        <Badge variant="outline">Reflectivity: {material.properties.reflectivity}</Badge>
                      )}
                      {material.properties.roughness !== undefined && (
                        <Badge variant="outline">Roughness: {material.properties.roughness}</Badge>
                      )}
                      {material.properties.metalness !== undefined && (
                        <Badge variant="outline">Metalness: {material.properties.metalness}</Badge>
                      )}
                      {material.properties.emissive && <Badge variant="outline">Emissive</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
