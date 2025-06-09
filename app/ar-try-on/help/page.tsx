"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ARHelpPage() {
  return (
    <div className="container px-4 py-12 mx-auto max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/ar-try-on">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">AR Try-On Help</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Use AR Try-On</CardTitle>
          <CardDescription>Learn how to get the best results with AR try-on.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=600&query=AR try-on tutorial screenshot"
                alt="AR Try-On Tutorial"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quick Start Guide</h3>
              <ol className="space-y-2 ml-5 list-decimal text-muted-foreground">
                <li>Upload a photo or take a new one</li>
                <li>Select an AR-ready NFT from your collection</li>
                <li>Adjust position, size, and rotation</li>
                <li>Save or share your creation</li>
              </ol>
              <p className="text-sm text-muted-foreground">
                For best results, use well-lit photos with a clear view of where you want to place the NFT.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What makes an NFT "AR-ready"?</AccordionTrigger>
                  <AccordionContent>
                    AR-ready NFTs have been processed with special metadata and transparent backgrounds that allow them
                    to be placed realistically on photos. Not all NFTs are AR-ready, but we're constantly working to
                    make more of your collection compatible with AR try-on.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I try on multiple NFTs at once?</AccordionTrigger>
                  <AccordionContent>
                    Currently, you can try on one NFT at a time. We're working on a feature to allow multiple NFTs to be
                    placed on a single photo for complete outfit creation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What photo formats are supported?</AccordionTrigger>
                  <AccordionContent>
                    We support JPEG, PNG, and WebP formats. For best results, use high-resolution images with good
                    lighting. The maximum file size is 5MB.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I use AR try-on on mobile devices?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Our AR try-on feature works on both desktop and mobile devices. On mobile, you can also take
                    photos directly with your camera for immediate try-on.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Where are my AR try-on images saved?</AccordionTrigger>
                  <AccordionContent>
                    Your AR try-on images are saved to your ENTIRE account gallery. You can access them anytime from the
                    AR Gallery section. You can also download them to your device or share them directly to social
                    media.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tips & Tricks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Lighting Matters</h3>
                <p className="text-sm text-muted-foreground">
                  Use photos with consistent, even lighting for the most realistic results. Harsh shadows or very bright
                  spots can make the AR overlay look less natural.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Positioning Tips</h3>
                <p className="text-sm text-muted-foreground">
                  For clothing items, take photos facing forward with your arms slightly away from your body. For
                  accessories like glasses or hats, face the camera directly and keep your head level.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Size Adjustments</h3>
                <p className="text-sm text-muted-foreground">
                  Start with the NFT at 100% scale and then adjust up or down as needed. For more precise positioning,
                  make small adjustments to both position and rotation.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Social Media Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  When sharing to social media, add hashtags #ENTIREfashion and #ARfashion to connect with the community
                  and showcase your digital fashion style.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="trouble-1">
                  <AccordionTrigger>My photo won't upload</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Try these steps:</p>
                    <ul className="space-y-1 ml-5 list-disc text-muted-foreground">
                      <li>Check that your file is under 5MB</li>
                      <li>Make sure it's a supported format (JPEG, PNG, WebP)</li>
                      <li>Try a different browser or device</li>
                      <li>If using mobile, ensure you've granted camera permissions</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-2">
                  <AccordionTrigger>The NFT looks distorted on my photo</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">This can happen for a few reasons:</p>
                    <ul className="space-y-1 ml-5 list-disc text-muted-foreground">
                      <li>The angle of the photo doesn't match the NFT's perspective</li>
                      <li>The scale might be too large or small</li>
                      <li>Try adjusting the rotation to better match your pose</li>
                      <li>Some NFTs work better with specific photo angles</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-3">
                  <AccordionTrigger>My NFT isn't showing as AR-ready</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Not all NFTs are AR-ready yet. Here's what you can do:</p>
                    <ul className="space-y-1 ml-5 list-disc text-muted-foreground">
                      <li>Check if there's an updated version of your NFT</li>
                      <li>Request AR processing for your NFT in the Settings section</li>
                      <li>Some complex NFTs with special effects may not be suitable for AR</li>
                      <li>New NFTs may take up to 24 hours to become AR-ready after purchase</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-4">
                  <AccordionTrigger>The AR try-on is slow or freezing</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Performance issues can be resolved by:</p>
                    <ul className="space-y-1 ml-5 list-disc text-muted-foreground">
                      <li>Using a smaller image file</li>
                      <li>Closing other browser tabs and applications</li>
                      <li>Clearing your browser cache</li>
                      <li>Using a device with better processing power</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
