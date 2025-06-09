"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackgroundUploader } from "@/components/ar-try-on/background-uploader"
import { BackgroundCustomizer } from "@/components/ar-try-on/background-customizer"
import { CustomBackgroundsManager } from "@/components/ar-try-on/custom-backgrounds-manager"
import { useToast } from "@/hooks/use-toast"
import {
  createCustomBackground,
  type CustomSceneBackground,
  SceneBackgroundCategory,
  updateCustomBackground,
} from "@/services/custom-scene-backgrounds"

export default function CustomScenesPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [backgroundName, setBackgroundName] = useState("")
  const [backgroundDescription, setBackgroundDescription] = useState("")
  const [backgroundCategory, setBackgroundCategory] = useState<SceneBackgroundCategory>(SceneBackgroundCategory.STUDIO)
  const [isPublic, setIsPublic] = useState(false)
  const [filters, setFilters] = useState<CustomSceneBackground["filters"]>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  })
  const [editingBackgroundId, setEditingBackgroundId] = useState<string | null>(null)
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock user ID (in a real app, this would come from authentication)
  const userId = "user-123"

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl)
  }

  const handleSaveFilters = (newFilters: CustomSceneBackground["filters"]) => {
    setFilters(newFilters)
    toast({
      title: "Filters applied",
      description: "Your background filters have been applied",
    })
  }

  const handleSaveBackground = () => {
    if (!uploadedImageUrl) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image for your custom background",
        variant: "destructive",
      })
      return
    }

    if (!backgroundName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your custom background",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingBackgroundId) {
        // Update existing background
        const updated = updateCustomBackground(editingBackgroundId, {
          name: backgroundName,
          description: backgroundDescription,
          category: backgroundCategory,
          isPublic,
          filters,
        })

        if (updated) {
          toast({
            title: "Background updated",
            description: "Your custom background has been updated successfully",
          })
          resetForm()
          setActiveTab("manage")
        }
      } else {
        // Create new background
        const newBackground = createCustomBackground(
          userId,
          backgroundName,
          backgroundDescription,
          uploadedImageUrl,
          backgroundCategory,
          filters,
          isPublic,
        )

        toast({
          title: "Background created",
          description: "Your custom background has been created successfully",
        })
        resetForm()
        setActiveTab("manage")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save background",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setUploadedImageUrl(null)
    setBackgroundName("")
    setBackgroundDescription("")
    setBackgroundCategory(SceneBackgroundCategory.STUDIO)
    setIsPublic(false)
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
    })
    setEditingBackgroundId(null)
  }

  const handleEditBackground = (background: CustomSceneBackground) => {
    setEditingBackgroundId(background.id)
    setUploadedImageUrl(background.imageUrl)
    setBackgroundName(background.name)
    setBackgroundDescription(background.description)
    setBackgroundCategory(background.category)
    setIsPublic(background.isPublic)
    setFilters(background.filters)
    setActiveTab("create")
  }

  const handleSelectBackground = (background: CustomSceneBackground) => {
    setSelectedBackgroundId(background.id)
    // In a real app, this would update the AR scene with the selected background
    toast({
      title: "Background selected",
      description: `${background.name} has been selected for your AR scene`,
    })
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/ar-try-on">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Custom Scene Creator</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <Card>
          <CardHeader>
            <CardTitle>Create & Manage Custom Scenes</CardTitle>
            <CardDescription>
              Upload your own images and customize them to create unique AR scene backgrounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create New</TabsTrigger>
                <TabsTrigger value="manage">Manage Saved</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="background-name">Background Name</Label>
                    <Input
                      id="background-name"
                      value={backgroundName}
                      onChange={(e) => setBackgroundName(e.target.value)}
                      placeholder="e.g., Neon Studio"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="background-description">Description</Label>
                    <Textarea
                      id="background-description"
                      value={backgroundDescription}
                      onChange={(e) => setBackgroundDescription(e.target.value)}
                      placeholder="Describe your background scene..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="background-category">Category</Label>
                    <Select
                      value={backgroundCategory}
                      onValueChange={(value) => setBackgroundCategory(value as SceneBackgroundCategory)}
                    >
                      <SelectTrigger id="background-category" className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SceneBackgroundCategory.RUNWAY}>Runway</SelectItem>
                        <SelectItem value={SceneBackgroundCategory.STUDIO}>Studio</SelectItem>
                        <SelectItem value={SceneBackgroundCategory.URBAN}>Urban</SelectItem>
                        <SelectItem value={SceneBackgroundCategory.NATURE}>Nature</SelectItem>
                        <SelectItem value={SceneBackgroundCategory.FUTURISTIC}>Futuristic</SelectItem>
                        <SelectItem value={SceneBackgroundCategory.ABSTRACT}>Abstract</SelectItem>
                        <SelectItem value={SceneBackgroundCategory.EVENT}>Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="public-background" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="public-background">Make this background public</Label>
                  </div>

                  <BackgroundUploader onImageUploaded={handleImageUploaded} />
                </div>
              </TabsContent>

              <TabsContent value="manage" className="pt-6">
                <CustomBackgroundsManager
                  userId={userId}
                  onSelectBackground={handleSelectBackground}
                  onEditBackground={handleEditBackground}
                  selectedBackgroundId={selectedBackgroundId || undefined}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            {activeTab === "create" && (
              <Button onClick={handleSaveBackground} disabled={!uploadedImageUrl}>
                <Save className="w-4 h-4 mr-2" />
                {editingBackgroundId ? "Update Background" : "Save Background"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customize Background</CardTitle>
              <CardDescription>Adjust filters and effects for your background image</CardDescription>
            </CardHeader>
            <CardContent>
              <BackgroundCustomizer imageUrl={uploadedImageUrl} onSave={handleSaveFilters} initialFilters={filters} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                <li>Use high-resolution images for best results</li>
                <li>Avoid busy backgrounds that might distract from your fashion items</li>
                <li>Consider the lighting in your background to match your fashion items</li>
                <li>Use the blur filter to create depth and focus on the foreground</li>
                <li>Share your backgrounds with the community by making them public</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
