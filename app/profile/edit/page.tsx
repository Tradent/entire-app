"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const userData = {
  id: "user123",
  username: "fashion_pioneer",
  displayName: "Fashion Pioneer",
  bio: "Digital fashion enthusiast and collector. Building the future of fashion in the metaverse.",
  avatar: "/diverse-avatars.png",
  coverImage: "/digital-fashion-abstract.png",
  walletAddress: "8xDR8MgCLZGJ7ZiMVxKnMQPQpKJqZnPzTvzH4xJsHHgA",
  email: "pioneer@fashion.io",
  socialLinks: {
    twitter: "fashion_pioneer",
    instagram: "fashion_pioneer",
    website: "fashionpioneer.io",
  },
  preferences: {
    emailNotifications: true,
    marketingEmails: false,
    activityAlerts: true,
    hideWalletAddress: false,
  },
}

export default function EditProfilePage() {
  const [formData, setFormData] = useState(userData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handlePreferenceChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    }, 1500)
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                      @
                    </span>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. Maximum 160 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  <p className="text-xs text-muted-foreground">
                    Your email address is only used for notifications and is not displayed publicly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media accounts to your profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                      twitter.com/
                    </span>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleSocialLinkChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                      instagram.com/
                    </span>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleSocialLinkChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.socialLinks.website}
                    onChange={handleSocialLinkChange}
                    placeholder="https://"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your notification and privacy settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications about your activity</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={formData.preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={formData.preferences.marketingEmails}
                    onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activityAlerts">Activity Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts about your NFT activity</p>
                  </div>
                  <Switch
                    id="activityAlerts"
                    checked={formData.preferences.activityAlerts}
                    onCheckedChange={(checked) => handlePreferenceChange("activityAlerts", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hideWalletAddress">Hide Wallet Address</Label>
                    <p className="text-sm text-muted-foreground">Hide your wallet address from your public profile</p>
                  </div>
                  <Switch
                    id="hideWalletAddress"
                    checked={formData.preferences.hideWalletAddress}
                    onCheckedChange={(checked) => handlePreferenceChange("hideWalletAddress", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture to personalize your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={avatarPreview || formData.avatar} alt={formData.displayName} />
                    <AvatarFallback>{formData.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex justify-center">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted">
                      <Upload className="w-4 h-4" />
                      <span>Upload new image</span>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Recommended: Square image, at least 400x400px
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>Upload a cover image for your profile header.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-[3/1] overflow-hidden rounded-md bg-muted">
                  <img src={coverPreview || formData.coverImage} alt="Cover" className="object-cover w-full h-full" />
                  {(coverPreview || formData.coverImage) && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      type="button"
                      onClick={() => {
                        setCoverPreview(null)
                        setCoverFile(null)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="flex justify-center">
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted">
                      <Upload className="w-4 h-4" />
                      <span>Upload new cover</span>
                    </div>
                    <input
                      id="cover-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-center text-muted-foreground">Recommended: 1200x400px, JPG or PNG format</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Address</CardTitle>
                <CardDescription>Your connected wallet address.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 overflow-hidden font-mono text-sm bg-muted rounded-md">
                  <p className="truncate">{formData.walletAddress}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  This is the wallet address connected to your profile. To change it, you need to disconnect and connect
                  a different wallet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link href="/profile">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
