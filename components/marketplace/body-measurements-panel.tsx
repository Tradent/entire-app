"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Ruler, Save, User, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export interface BodyMeasurement {
  id: string
  name: string
  value: number
}

interface BodyMeasurementsPanelProps {
  measurements: BodyMeasurement[]
  onSaveMeasurements: (measurements: BodyMeasurement[]) => void
  onCompareMeasurements: (bodyMeasurements: BodyMeasurement[]) => void
}

export default function BodyMeasurementsPanel({
  measurements,
  onSaveMeasurements,
  onCompareMeasurements,
}: BodyMeasurementsPanelProps) {
  const [editedMeasurements, setEditedMeasurements] = useState<BodyMeasurement[]>(measurements)
  const [profileName, setProfileName] = useState("My Measurements")
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handleValueChange = (id: string, value: number) => {
    setEditedMeasurements(editedMeasurements.map((m) => (m.id === id ? { ...m, value } : m)))
  }

  const handleSave = () => {
    onSaveMeasurements(editedMeasurements)
    setIsEditing(false)
    toast({
      title: "Measurements saved",
      description: "Your body measurements have been saved to your profile.",
    })
  }

  const handleCompare = () => {
    onCompareMeasurements(editedMeasurements)
    toast({
      title: "Comparing measurements",
      description: "Comparing your body measurements with the item.",
    })
  }

  const standardMeasurements: BodyMeasurement[] = [
    { id: "chest", name: "Chest", value: 100 },
    { id: "waist", name: "Waist", value: 80 },
    { id: "hips", name: "Hips", value: 100 },
    { id: "inseam", name: "Inseam", value: 80 },
    { id: "shoulder", name: "Shoulder Width", value: 45 },
    { id: "sleeve", name: "Sleeve Length", value: 65 },
  ]

  const resetToDefaults = () => {
    setEditedMeasurements(standardMeasurements)
    toast({
      title: "Measurements reset",
      description: "Your measurements have been reset to standard values.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium">{profileName}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        {editedMeasurements.map((measurement) => (
          <div key={measurement.id} className="flex items-center justify-between">
            <Label htmlFor={`measurement-${measurement.id}`} className="flex-1">
              {measurement.name}
            </Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  id={`measurement-${measurement.id}`}
                  type="number"
                  value={measurement.value}
                  onChange={(e) => handleValueChange(measurement.id, Number.parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
            ) : (
              <span>{measurement.value} cm</span>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <>
          <Separator />
          <div className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Trash2 className="w-4 h-4" />
                  Reset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Measurements</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset your measurements to standard values? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={resetToDefaults}>
                    Reset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} className="gap-1">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </>
      )}

      {!isEditing && (
        <>
          <Separator />
          <Button onClick={handleCompare} className="w-full gap-1">
            <Ruler className="w-4 h-4" />
            Compare with Item
          </Button>
        </>
      )}
    </div>
  )
}
