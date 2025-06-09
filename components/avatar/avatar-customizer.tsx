"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AvatarCustomizerProps {
  customization: {
    bodyType: string
    skinTone: string
    hairStyle: string
    hairColor: string
  }
  onChange: (key: string, value: string) => void
}

const skinTones = [
  { value: "#f8d5c2", label: "Light" },
  { value: "#e0c8b0", label: "Medium" },
  { value: "#b28b67", label: "Tan" },
  { value: "#8d5524", label: "Dark" },
  { value: "#5c3836", label: "Deep" },
]

const hairColors = [
  { value: "#090806", label: "Black" },
  { value: "#3a3a3a", label: "Dark Gray" },
  { value: "#8a3324", label: "Auburn" },
  { value: "#a55728", label: "Brown" },
  { value: "#e6cea8", label: "Blonde" },
  { value: "#e8e1e1", label: "White" },
  { value: "#b51d85", label: "Pink" },
  { value: "#3549db", label: "Blue" },
]

export default function AvatarCustomizer({ customization, onChange }: AvatarCustomizerProps) {
  return (
    <Tabs defaultValue="body">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="body">Body</TabsTrigger>
        <TabsTrigger value="face">Face</TabsTrigger>
        <TabsTrigger value="hair">Hair</TabsTrigger>
      </TabsList>

      <TabsContent value="body" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Body Type</Label>
          <RadioGroup
            value={customization.bodyType}
            onValueChange={(value) => onChange("bodyType", value)}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem value="a" id="body-a" className="sr-only" />
              <Label
                htmlFor="body-a"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
                  customization.bodyType === "a" && "border-primary",
                )}
              >
                <div className="w-12 h-20 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Type A</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="b" id="body-b" className="sr-only" />
              <Label
                htmlFor="body-b"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
                  customization.bodyType === "b" && "border-primary",
                )}
              >
                <div className="w-14 h-20 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Type B</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="c" id="body-c" className="sr-only" />
              <Label
                htmlFor="body-c"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
                  customization.bodyType === "c" && "border-primary",
                )}
              >
                <div className="w-16 h-20 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Type C</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Skin Tone</Label>
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: customization.skinTone }}></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {skinTones.map((tone) => (
              <button
                key={tone.value}
                className={cn(
                  "w-full h-8 rounded-md border",
                  customization.skinTone === tone.value && "ring-2 ring-primary",
                )}
                style={{ backgroundColor: tone.value }}
                onClick={() => onChange("skinTone", tone.value)}
                title={tone.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Height</Label>
          <Slider defaultValue={[50]} max={100} step={1} onValueChange={(value) => console.log(value)} />
        </div>

        <div className="space-y-2">
          <Label>Build</Label>
          <Slider defaultValue={[50]} max={100} step={1} onValueChange={(value) => console.log(value)} />
        </div>
      </TabsContent>

      <TabsContent value="face" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Eye Shape</Label>
          <RadioGroup
            defaultValue="round"
            onValueChange={(value) => console.log(value)}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem value="round" id="eye-round" className="sr-only" />
              <Label
                htmlFor="eye-round"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-12 h-6 bg-muted rounded-full mb-2"></div>
                <span className="text-xs">Round</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="almond" id="eye-almond" className="sr-only" />
              <Label
                htmlFor="eye-almond"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-12 h-4 bg-muted rounded-full mb-2"></div>
                <span className="text-xs">Almond</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="wide" id="eye-wide" className="sr-only" />
              <Label
                htmlFor="eye-wide"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-14 h-5 bg-muted rounded-full mb-2"></div>
                <span className="text-xs">Wide</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Eye Color</Label>
          <div className="grid grid-cols-4 gap-2">
            {["#634e34", "#2e536f", "#3f6618", "#634e34"].map((color, i) => (
              <button key={i} className="w-full h-8 rounded-md border" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Nose Shape</Label>
          <RadioGroup
            defaultValue="medium"
            onValueChange={(value) => console.log(value)}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem value="small" id="nose-small" className="sr-only" />
              <Label
                htmlFor="nose-small"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-4 h-6 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Small</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="medium" id="nose-medium" className="sr-only" />
              <Label
                htmlFor="nose-medium"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-5 h-8 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Medium</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="wide" id="nose-wide" className="sr-only" />
              <Label
                htmlFor="nose-wide"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-7 h-7 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Wide</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </TabsContent>

      <TabsContent value="hair" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Hair Style</Label>
          <RadioGroup
            value={customization.hairStyle}
            onValueChange={(value) => onChange("hairStyle", value)}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem value="short" id="hair-short" className="sr-only" />
              <Label
                htmlFor="hair-short"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
                  customization.hairStyle === "short" && "border-primary",
                )}
              >
                <div className="w-10 h-6 bg-muted rounded-t-full mb-2"></div>
                <span className="text-xs">Short</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="medium" id="hair-medium" className="sr-only" />
              <Label
                htmlFor="hair-medium"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
                  customization.hairStyle === "medium" && "border-primary",
                )}
              >
                <div className="w-12 h-10 bg-muted rounded-t-full mb-2"></div>
                <span className="text-xs">Medium</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="long" id="hair-long" className="sr-only" />
              <Label
                htmlFor="hair-long"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground",
                  customization.hairStyle === "long" && "border-primary",
                )}
              >
                <div className="w-12 h-14 bg-muted rounded-t-full mb-2"></div>
                <span className="text-xs">Long</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Hair Color</Label>
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: customization.hairColor }}></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {hairColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-full h-8 rounded-md border",
                  customization.hairColor === color.value && "ring-2 ring-primary",
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => onChange("hairColor", color.value)}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
