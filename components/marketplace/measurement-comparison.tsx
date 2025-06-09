"use client"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { BodyMeasurement } from "@/components/marketplace/body-measurements-panel"
import type { Measurement } from "@/components/marketplace/measurement-tools"

interface MeasurementComparisonProps {
  bodyMeasurements: BodyMeasurement[]
  itemMeasurements: Measurement[]
}

export default function MeasurementComparison({ bodyMeasurements, itemMeasurements }: MeasurementComparisonProps) {
  // Map item measurements to body measurements based on name similarity
  const getMappedMeasurements = () => {
    return itemMeasurements.map((itemMeasurement) => {
      // Try to find a matching body measurement
      const matchingBodyMeasurement = bodyMeasurements.find(
        (bodyMeasurement) =>
          itemMeasurement.name.toLowerCase().includes(bodyMeasurement.name.toLowerCase()) ||
          bodyMeasurement.name.toLowerCase().includes(itemMeasurement.name.toLowerCase()),
      )

      if (matchingBodyMeasurement) {
        const fitPercentage = calculateFitPercentage(itemMeasurement.distance, matchingBodyMeasurement.value)
        const fitStatus = getFitStatus(fitPercentage)

        return {
          itemMeasurement,
          bodyMeasurement: matchingBodyMeasurement,
          fitPercentage,
          fitStatus,
        }
      }

      return {
        itemMeasurement,
        bodyMeasurement: null,
        fitPercentage: null,
        fitStatus: "unknown",
      }
    })
  }

  // Calculate how well the item fits based on the measurements
  const calculateFitPercentage = (itemValue: number, bodyValue: number) => {
    // For simplicity, we'll use a basic calculation
    // In a real app, this would be more sophisticated based on the type of measurement
    const difference = Math.abs(itemValue - bodyValue)
    const tolerance = bodyValue * 0.1 // 10% tolerance

    if (difference <= tolerance) {
      // Good fit - within tolerance
      return 100 - (difference / tolerance) * 20 // 80-100%
    } else {
      // Not ideal fit - beyond tolerance
      return Math.max(0, 80 - (difference - tolerance) * 5) // 0-80%
    }
  }

  // Get fit status based on percentage
  const getFitStatus = (percentage: number | null) => {
    if (percentage === null) return "unknown"
    if (percentage >= 80) return "good"
    if (percentage >= 50) return "fair"
    return "poor"
  }

  const mappedMeasurements = getMappedMeasurements()

  // Calculate overall fit score
  const matchedMeasurements = mappedMeasurements.filter((m) => m.bodyMeasurement !== null)
  const overallFitPercentage =
    matchedMeasurements.length > 0
      ? matchedMeasurements.reduce((sum, m) => sum + (m.fitPercentage || 0), 0) / matchedMeasurements.length
      : 0

  const overallFitStatus = getFitStatus(overallFitPercentage)

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Overall Fit</h3>
          <Badge
            variant={overallFitStatus === "good" ? "default" : overallFitStatus === "fair" ? "outline" : "destructive"}
          >
            {overallFitStatus === "good" ? "Good Fit" : overallFitStatus === "fair" ? "Fair Fit" : "Poor Fit"}
          </Badge>
        </div>
        <Progress value={overallFitPercentage} className="h-2" />
        <p className="mt-2 text-sm text-muted-foreground">
          {overallFitStatus === "good"
            ? "This item should fit you well based on your measurements."
            : overallFitStatus === "fair"
              ? "This item may fit you, but could be tight or loose in some areas."
              : "This item may not fit you well based on your measurements."}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="measurements">
          <AccordionTrigger>Detailed Comparison</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {mappedMeasurements.map((mapping, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: mapping.itemMeasurement.color }}
                      ></div>
                      <span className="font-medium">{mapping.itemMeasurement.name}</span>
                    </div>
                    {mapping.bodyMeasurement &&
                      (mapping.fitStatus === "good" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : mapping.fitStatus === "fair" ? (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Item</p>
                      <p>{mapping.itemMeasurement.distance.toFixed(1)} cm</p>
                    </div>

                    {mapping.bodyMeasurement ? (
                      <div>
                        <p className="text-xs text-muted-foreground">Your Measurement</p>
                        <p>{mapping.bodyMeasurement.value} cm</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-muted-foreground">Your Measurement</p>
                        <p className="italic text-muted-foreground">No matching measurement</p>
                      </div>
                    )}
                  </div>

                  {mapping.fitPercentage !== null && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-muted-foreground">Fit</p>
                        <p className="text-xs">{mapping.fitPercentage.toFixed(0)}%</p>
                      </div>
                      <Progress value={mapping.fitPercentage} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
