"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sun, Moon, Lamp, Sparkles } from "lucide-react"

interface EnvironmentOption {
  id: string
  name: string
  icon: React.ReactNode
}

interface EnvironmentSelectorProps {
  selected: string
  onChange: (environment: string) => void
  disabled?: boolean
}

const environments: EnvironmentOption[] = [
  {
    id: "neutral",
    name: "Neutral",
    icon: <Sun className="w-4 h-4" />,
  },
  {
    id: "studio",
    name: "Studio",
    icon: <Lamp className="w-4 h-4" />,
  },
  {
    id: "outdoor",
    name: "Outdoor",
    icon: <Sun className="w-4 h-4" />,
  },
  {
    id: "night",
    name: "Night",
    icon: <Moon className="w-4 h-4" />,
  },
  {
    id: "neon",
    name: "Neon",
    icon: <Sparkles className="w-4 h-4" />,
  },
]

export default function EnvironmentSelector({ selected, onChange, disabled = false }: EnvironmentSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {environments.map((env) => (
          <Button
            key={env.id}
            variant={selected === env.id ? "default" : "outline"}
            size="sm"
            className={cn("flex items-center gap-1", disabled && "opacity-50 cursor-not-allowed")}
            onClick={() => !disabled && onChange(env.id)}
            disabled={disabled}
          >
            {env.icon}
            <span>{env.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
