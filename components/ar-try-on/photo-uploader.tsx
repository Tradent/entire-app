"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface PhotoUploaderProps {
  onPhotoUpload: (url: string) => void
}

export default function PhotoUploader({ onPhotoUpload }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.).",
        variant: "destructive",
      })
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Create a URL for the file
    const url = URL.createObjectURL(file)
    onPhotoUpload(url)
  }

  const handleTakePhoto = () => {
    toast({
      title: "Camera access",
      description: "Opening camera to take a new photo.",
    })
  }

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full p-6 border-2 border-dashed rounded-lg ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-medium">Upload a Photo</h3>
      <p className="mb-4 text-sm text-center text-muted-foreground">
        Drag and drop a photo here, or click to select a file
      </p>
      <div className="flex gap-4">
        <Button onClick={() => fileInputRef.current?.click()}>Select Photo</Button>
        <Button variant="outline" className="gap-2" onClick={handleTakePhoto}>
          <Camera className="w-4 h-4" />
          Take Photo
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        className="hidden"
        data-testid="file-input"
      />
      <p className="mt-4 text-xs text-muted-foreground">Supported formats: JPEG, PNG, WebP</p>
    </div>
  )
}
