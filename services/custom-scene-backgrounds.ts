import { v4 as uuidv4 } from "uuid"
import { type SceneBackground, SceneBackgroundType } from "./ar-scene-backgrounds"

export enum SceneBackgroundCategory {
  STUDIO = "studio",
  URBAN = "urban",
  NATURE = "nature",
  ABSTRACT = "abstract",
  FASHION = "fashion",
  CUSTOM = "custom",
}

export interface CustomSceneBackground extends SceneBackground {
  userId: string
  createdAt: Date
  lastModified: Date
  isPublic: boolean
  filters: {
    brightness: number
    contrast: number
    saturation: number
    blur: number
    overlay?: string
    overlayOpacity?: number
  }
}

// Mock storage for custom backgrounds (in a real app, this would be in a database)
let customBackgrounds: CustomSceneBackground[] = []

export const createCustomBackground = (
  userId: string,
  name: string,
  description: string,
  imageUrl: string,
  category: SceneBackgroundCategory,
  filters: CustomSceneBackground["filters"] = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  },
  isPublic = false,
): CustomSceneBackground => {
  const newBackground: CustomSceneBackground = {
    id: uuidv4(),
    name,
    description,
    imageUrl,
    category,
    type: SceneBackgroundType.IMAGE,
    userId,
    createdAt: new Date(),
    lastModified: new Date(),
    isPublic,
    filters,
  }

  customBackgrounds.push(newBackground)
  return newBackground
}

export const updateCustomBackground = (
  backgroundId: string,
  updates: Partial<Omit<CustomSceneBackground, "id" | "userId" | "createdAt">>,
): CustomSceneBackground | null => {
  const index = customBackgrounds.findIndex((bg) => bg.id === backgroundId)
  if (index === -1) return null

  const updatedBackground = {
    ...customBackgrounds[index],
    ...updates,
    lastModified: new Date(),
  }

  customBackgrounds[index] = updatedBackground
  return updatedBackground
}

export const deleteCustomBackground = (backgroundId: string): boolean => {
  const initialLength = customBackgrounds.length
  customBackgrounds = customBackgrounds.filter((bg) => bg.id !== backgroundId)
  return customBackgrounds.length < initialLength
}

export const getCustomBackgroundsByUser = (userId: string): CustomSceneBackground[] => {
  return customBackgrounds.filter((bg) => bg.userId === userId)
}

export const getCustomBackgroundById = (backgroundId: string): CustomSceneBackground | undefined => {
  return customBackgrounds.find((bg) => bg.id === backgroundId)
}

export const getPublicCustomBackgrounds = (): CustomSceneBackground[] => {
  return customBackgrounds.filter((bg) => bg.isPublic)
}

// Helper function to apply filters to a background image on a canvas
export const applyBackgroundFilters = (
  ctx: CanvasRenderingContext2D,
  filters: CustomSceneBackground["filters"],
): void => {
  ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`

  // If there's an overlay, apply it
  if (filters.overlay && filters.overlayOpacity) {
    // This would be implemented in a real app
    // For now, we'll just set a globalAlpha
    ctx.globalAlpha = filters.overlayOpacity / 100
    // Then draw the overlay
    // ctx.drawImage(overlayImage, 0, 0, width, height)
    // Reset alpha
    ctx.globalAlpha = 1.0
  }
}
