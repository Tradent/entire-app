"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function NewsCategories() {
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = [
    "All",
    "NFTs",
    "Metaverse",
    "Digital Fashion",
    "Technology",
    "Sustainability",
    "Events",
    "Designers",
  ]

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>
    </section>
  )
}
