export interface SceneBackground {
  id: string
  name: string
  description: string
  imageUrl: string
  category: SceneBackgroundCategory
  type: SceneBackgroundType
}

export enum SceneBackgroundCategory {
  RUNWAY = "runway",
  STUDIO = "studio",
  URBAN = "urban",
  NATURE = "nature",
  FUTURISTIC = "futuristic",
  ABSTRACT = "abstract",
  EVENT = "event",
}

export enum SceneBackgroundType {
  IMAGE = "image",
  VIDEO = "video",
  INTERACTIVE_3D = "interactive_3d",
}

export const sceneBackgrounds: SceneBackground[] = [
  {
    id: "runway-classic",
    name: "Classic Runway",
    description: "A traditional fashion runway with bright lights",
    imageUrl: "/placeholder.svg?key=0asj2",
    category: SceneBackgroundCategory.RUNWAY,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "runway-futuristic",
    name: "Futuristic Runway",
    description: "A high-tech runway with neon lights and digital effects",
    imageUrl: "/neon-threads.png",
    category: SceneBackgroundCategory.RUNWAY,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "studio-white",
    name: "White Studio",
    description: "Clean white photography studio with soft lighting",
    imageUrl: "/minimalist-studio.png",
    category: SceneBackgroundCategory.STUDIO,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "studio-gradient",
    name: "Gradient Studio",
    description: "Studio with a smooth color gradient background",
    imageUrl: "/gradient-studio.png",
    category: SceneBackgroundCategory.STUDIO,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "urban-street",
    name: "City Street",
    description: "Busy urban street with modern architecture",
    imageUrl: "/urban-pulse.png",
    category: SceneBackgroundCategory.URBAN,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "urban-night",
    name: "Night City",
    description: "Nighttime cityscape with neon lights",
    imageUrl: "/placeholder.svg?height=300&width=500&query=nighttime cityscape with neon lights",
    category: SceneBackgroundCategory.URBAN,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "nature-forest",
    name: "Forest",
    description: "Lush green forest with dappled sunlight",
    imageUrl: "/placeholder.svg?height=300&width=500&query=lush green forest with dappled sunlight",
    category: SceneBackgroundCategory.NATURE,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "nature-beach",
    name: "Beach Sunset",
    description: "Beautiful beach at sunset with golden light",
    imageUrl: "/placeholder.svg?height=300&width=500&query=beautiful beach at sunset with golden light",
    category: SceneBackgroundCategory.NATURE,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "futuristic-space",
    name: "Space Station",
    description: "Futuristic space station interior with Earth view",
    imageUrl: "/placeholder.svg?height=300&width=500&query=futuristic space station interior with Earth view",
    category: SceneBackgroundCategory.FUTURISTIC,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "futuristic-cyber",
    name: "Cyberpunk City",
    description: "Cyberpunk cityscape with holographic displays",
    imageUrl: "/placeholder.svg?height=300&width=500&query=cyberpunk cityscape with holographic displays",
    category: SceneBackgroundCategory.FUTURISTIC,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "abstract-geometric",
    name: "Geometric Patterns",
    description: "Abstract geometric patterns with vibrant colors",
    imageUrl: "/placeholder.svg?height=300&width=500&query=abstract geometric patterns with vibrant colors",
    category: SceneBackgroundCategory.ABSTRACT,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "abstract-fluid",
    name: "Fluid Art",
    description: "Abstract fluid art with flowing colors",
    imageUrl: "/placeholder.svg?height=300&width=500&query=abstract fluid art with flowing colors",
    category: SceneBackgroundCategory.ABSTRACT,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "event-gala",
    name: "Fashion Gala",
    description: "Elegant fashion gala with red carpet",
    imageUrl: "/placeholder.svg?height=300&width=500&query=elegant fashion gala with red carpet",
    category: SceneBackgroundCategory.EVENT,
    type: SceneBackgroundType.IMAGE,
  },
  {
    id: "event-afterparty",
    name: "Fashion Afterparty",
    description: "Stylish afterparty with mood lighting",
    imageUrl: "/placeholder.svg?height=300&width=500&query=stylish fashion afterparty with mood lighting",
    category: SceneBackgroundCategory.EVENT,
    type: SceneBackgroundType.IMAGE,
  },
]

export const getSceneBackgroundById = (id: string): SceneBackground | undefined => {
  return sceneBackgrounds.find((background) => background.id === id)
}

export const getSceneBackgroundsByCategory = (category: SceneBackgroundCategory): SceneBackground[] => {
  return sceneBackgrounds.filter((background) => background.category === category)
}

export const getAllSceneBackgroundCategories = (): SceneBackgroundCategory[] => {
  return Object.values(SceneBackgroundCategory)
}

export const getCategoryDisplayName = (category: SceneBackgroundCategory): string => {
  switch (category) {
    case SceneBackgroundCategory.RUNWAY:
      return "Runway"
    case SceneBackgroundCategory.STUDIO:
      return "Studio"
    case SceneBackgroundCategory.URBAN:
      return "Urban"
    case SceneBackgroundCategory.NATURE:
      return "Nature"
    case SceneBackgroundCategory.FUTURISTIC:
      return "Futuristic"
    case SceneBackgroundCategory.ABSTRACT:
      return "Abstract"
    case SceneBackgroundCategory.EVENT:
      return "Event"
    default:
      return "Unknown"
  }
}
