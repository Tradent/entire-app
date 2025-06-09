"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BackgroundUploaderProps {
  onImageUploaded: (imageUrl: string) => void
}

export function BackgroundUploader({ onImageUploaded }: BackgroundUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create a preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onImageUploaded(url)

    toast({
      title: "Image uploaded",
      description: "Your background image has been uploaded successfully",
    })
  }

  const clearImage = () => {
    setPreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload background image</h3>
              <p className="text-sm text-muted-foreground">Drag and drop your image here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports: JPEG, PNG, WebP • Max size: 5MB</p>
            </div>
            <Label htmlFor="background-upload" className="cursor-pointer">
              <Button variant="outline" type="button" onClick={() => inputRef.current?.click()}>
                Choose file
              </Button>
              <Input
                id="background-upload"
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </Label>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border">
          <img src={previewUrl || "/placeholder.svg"} alt="Background preview" className="w-full h-48 object-cover" />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
