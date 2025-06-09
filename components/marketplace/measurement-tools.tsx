"use client"

import { useState, useEffect } from "react"
import { type Vector3, Mesh } from "three"
import { useThree, useFrame } from "@react-three/fiber"
import { Html, Line } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface Measurement {
  id: string
  name: string
  points: Vector3[]
  distance: number
  color: string
}

interface MeasurementToolsProps {
  isActive: boolean
  onMeasurementComplete: (measurement: Measurement) => void
  measurements: Measurement[]
  onDeleteMeasurement: (id: string) => void
}

export function MeasurementTools({
  isActive,
  onMeasurementComplete,
  measurements,
  onDeleteMeasurement,
}: MeasurementToolsProps) {
  const [points, setPoints] = useState<Vector3[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<Vector3 | null>(null)
  const { camera, raycaster, scene, gl } = useThree()
  const measurementColors = ["#ff3366", "#33cc99", "#6666ff", "#ffcc33", "#cc33ff"]

  // Handle mouse move to show potential measurement point
  useFrame(() => {
    if (!isActive) return

    const mouse = gl.domElement.getMouse()
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
      const intersect = intersects.find((i) => i.object instanceof Mesh)
      if (intersect) {
        setHoveredPoint(intersect.point)
      } else {
        setHoveredPoint(null)
      }
    } else {
      setHoveredPoint(null)
    }
  })

  // Handle click to add measurement point
  const handleClick = (event: MouseEvent) => {
    if (!isActive || !hoveredPoint) return

    event.preventDefault()
    event.stopPropagation()

    const newPoints = [...points, hoveredPoint.clone()]
    setPoints(newPoints)

    // If we have two points, complete the measurement
    if (newPoints.length === 2) {
      const distance = newPoints[0].distanceTo(newPoints[1])
      const measurementId = `measurement-${Date.now()}`
      const colorIndex = measurements.length % measurementColors.length

      onMeasurementComplete({
        id: measurementId,
        name: `Measurement ${measurements.length + 1}`,
        points: newPoints,
        distance: Number.parseFloat(distance.toFixed(2)),
        color: measurementColors[colorIndex],
      })

      // Reset points for next measurement
      setPoints([])
    }
  }

  // Add and remove event listeners
  useEffect(() => {
    if (isActive) {
      gl.domElement.addEventListener("click", handleClick)
    }

    return () => {
      gl.domElement.removeEventListener("click", handleClick)
    }
  }, [isActive, hoveredPoint, points, gl.domElement])

  return (
    <>
      {/* Show hovered point indicator */}
      {isActive && hoveredPoint && (
        <mesh position={hoveredPoint}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      )}

      {/* Show current measurement in progress */}
      {isActive && points.length === 1 && hoveredPoint && (
        <>
          <Line points={[points[0], hoveredPoint]} color="#ffffff" lineWidth={2} dashed={true} />
          <mesh position={points[0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Show all completed measurements */}
      {measurements.map((measurement) => (
        <group key={measurement.id}>
          <Line points={measurement.points} color={measurement.color} lineWidth={3} />

          {measurement.points.map((point, index) => (
            <mesh key={`${measurement.id}-point-${index}`} position={point}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshBasicMaterial color={measurement.color} />
            </mesh>
          ))}

          {/* Measurement label */}
          <Html
            position={[
              (measurement.points[0].x + measurement.points[1].x) / 2,
              (measurement.points[0].y + measurement.points[1].y) / 2,
              (measurement.points[0].z + measurement.points[1].z) / 2,
            ]}
            distanceFactor={10}
          >
            <div
              className="px-2 py-1 text-xs text-white rounded-md flex items-center gap-1"
              style={{ backgroundColor: measurement.color }}
            >
              <span>{measurement.distance.toFixed(2)} cm</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full bg-white/20 hover:bg-white/40 p-0"
                onClick={() => onDeleteMeasurement(measurement.id)}
              >
                <X className="h-2 w-2" />
              </Button>
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}

// Add a method to HTMLCanvasElement to get normalized mouse coordinates
declare global {
  interface HTMLCanvasElement {
    getMouse: () => { x: number; y: number }
  }
}

HTMLCanvasElement.prototype.getMouse = function () {
  const rect = this.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  return { x, y }
}
