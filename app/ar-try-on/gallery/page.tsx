"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Mock data for AR try-on gallery
const mockGallery = [
  {
    id: 1,
    image: "/neon-jacket-ar-tryon.png",
    nftName: "Neon Dreams Jacket",
    date: "2 days ago",
  },
  {
    id: 2,
    image: "/placeholder.svg?key=8y6t2",
    nftName: "Holographic Headpiece",
    date: "1 week ago",
  },
  {
    id: 3,
    image: "/digital-glasses-try-on.png",
    nftName: "Digital Glasses",
    date: "2 weeks ago",
  },
  {
    id: 4,
    image: "/futuristic-sneaker-tryon.png",
    nftName: "Quantum Sneakers",
    date: "3 weeks ago",
  },
]

export default function ARGalleryPage() {
  const [gallery, setGallery] = useState(mockGallery)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const { toast } = useToast()

  const handleDelete = (id: number) => {
    setGallery(gallery.filter((item) => item.id !== id))
    toast({
      title: "Image deleted",
      description: "The AR try-on image has been removed from your gallery.",
    })
  }

  const handleDownload = (id: number) => {
    toast({
      title: "Image downloaded",
      description: "The AR try-on image has been saved to your device.",
    })
  }

  const handleShare = (id: number) => {
    toast({
      title: "Share options",
      description: "Opening share dialog for your AR try-on image.",
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
        <h1 className="text-3xl font-bold">AR Try-On Gallery</h1>
      </div>

      {gallery.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Images Yet</CardTitle>
            <CardDescription>Your AR try-on images will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="mb-4 text-center text-muted-foreground">
              Try on your fashion NFTs using AR and save the images to build your gallery.
            </p>
            <Link href="/ar-try-on">
              <Button>Create AR Try-On</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-[3/4]">
                <img src={item.image || "/placeholder.svg"} alt={item.nftName} className="object-cover w-full h-full" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{item.nftName}</h3>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare(item.id)}>
                    <Share2 className="w-4 h-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
                <Button size="sm" onClick={() => handleDownload(item.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
