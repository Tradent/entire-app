"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubmitPage() {
  const [activeTab, setActiveTab] = useState("brand")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Submission Complete</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-center">Thank You for Your Submission!</CardTitle>
            <CardDescription className="text-center">
              Your submission has been received and is being reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              We'll review your submission within 5-7 business days and contact you if your brand or collection is
              selected to be featured in ENTIRE magazine.
            </p>
            <p className="text-sm text-muted-foreground">
              Reference ID: ENTIRE-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Submit Your Work</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Your Fashion in ENTIRE</CardTitle>
          <CardDescription>
            Submit your digital fashion brand or collection for a chance to be featured in our magazine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="brand" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="brand">Brand Submission</TabsTrigger>
              <TabsTrigger value="collection">Collection Submission</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="brand" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" placeholder="Enter your brand name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-description">Brand Description</Label>
                  <Textarea
                    id="brand-description"
                    placeholder="Tell us about your brand, its vision, and aesthetic"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-website">Website or Social Media</Label>
                  <Input id="brand-website" placeholder="https://" type="url" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-category">Primary Category</Label>
                  <Select>
                    <SelectTrigger id="brand-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apparel">Apparel</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="mixed">Mixed/Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Brand Logo or Key Visual</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="brand-logo"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <Input id="brand-logo" type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collection" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="collection-name">Collection Name</Label>
                  <Input id="collection-name" placeholder="Enter your collection name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection-description">Collection Description</Label>
                  <Textarea
                    id="collection-description"
                    placeholder="Describe your collection, its theme, and unique features"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection-items">Number of Items</Label>
                  <Input id="collection-items" type="number" min="1" placeholder="e.g., 10" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection-blockchain">Blockchain</Label>
                  <Select defaultValue="solana">
                    <SelectTrigger id="collection-blockchain">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Collection Preview Images</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="collection-images"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">Upload up to 5 images (MAX. 5MB each)</p>
                      </div>
                      <Input id="collection-images" type="file" className="hidden" accept="image/*" multiple />
                    </label>
                  </div>
                </div>
              </TabsContent>

              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input id="contact-name" placeholder="Your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input id="contact-email" type="email" placeholder="your@email.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address (Optional)</Label>
                  <Input id="wallet-address" placeholder="Your Solana wallet address" />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : `Submit ${activeTab === "brand" ? "Brand" : "Collection"}`}
                  </Button>
                </div>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
