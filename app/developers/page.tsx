import Link from "next/link"
import { ArrowLeft, Code, FileCode, GitBranch, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function DevelopersPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Developer Portal</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                <Link
                  href="#getting-started"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <div className="w-1 h-6 bg-primary rounded-r-full" />
                  <span>Getting Started</span>
                </Link>
                <Link
                  href="#integration-guide"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <div className="w-1 h-6 bg-transparent rounded-r-full" />
                  <span>Integration Guide</span>
                </Link>
                <Link
                  href="#api-reference"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <div className="w-1 h-6 bg-transparent rounded-r-full" />
                  <span>API Reference</span>
                </Link>
                <Link
                  href="#sdk-documentation"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <div className="w-1 h-6 bg-transparent rounded-r-full" />
                  <span>SDK Documentation</span>
                </Link>
                <Link
                  href="#asset-standards"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <div className="w-1 h-6 bg-transparent rounded-r-full" />
                  <span>Asset Standards</span>
                </Link>
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                <Link
                  href="#github"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </Link>
                <Link
                  href="#npm"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Package className="w-4 h-4" />
                  <span>NPM Package</span>
                </Link>
                <Link
                  href="#examples"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Code className="w-4 h-4" />
                  <span>Example Projects</span>
                </Link>
                <Link
                  href="#discord"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Developer Discord</span>
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card id="getting-started">
            <CardHeader>
              <Badge className="w-fit mb-2">Documentation</Badge>
              <CardTitle>Getting Started with ENTIRE SDK</CardTitle>
              <CardDescription>
                Learn how to integrate ENTIRE's fashion NFTs into your metaverse game or platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="installation">Installation</TabsTrigger>
                  <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <p>
                    The ENTIRE SDK allows game developers to integrate fashion NFTs from the ENTIRE ecosystem into their
                    metaverse platforms. This enables users to wear their digital fashion items across multiple virtual
                    worlds, creating a seamless experience.
                  </p>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="mb-2 font-medium">Key Features</h3>
                    <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                      <li>Cross-platform compatibility for wearable NFTs</li>
                      <li>Standardized 3D asset format conversion</li>
                      <li>Real-time NFT ownership verification</li>
                      <li>Customizable rendering options for different platforms</li>
                      <li>Automatic updates for NFT metadata and properties</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="installation" className="space-y-4 pt-4">
                  <div className="p-4 font-mono text-sm bg-muted rounded-lg overflow-x-auto">
                    <pre>
                      {`# Using npm
npm install @entire/metaverse-sdk

# Using yarn
yarn add @entire/metaverse-sdk

# Using pnpm
pnpm add @entire/metaverse-sdk`}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The SDK is compatible with most JavaScript and TypeScript environments, including Node.js, React,
                    Three.js, and popular game engines with JavaScript runtimes.
                  </p>
                </TabsContent>
                <TabsContent value="quickstart" className="space-y-4 pt-4">
                  <div className="p-4 font-mono text-sm bg-muted rounded-lg overflow-x-auto">
                    <pre>
                      {`import { EntireSDK, NFTLoader } from '@entire/metaverse-sdk';

// Initialize the SDK with your API key
const entireSDK = new EntireSDK({
  apiKey: 'YOUR_API_KEY',
  platform: 'YOUR_PLATFORM_NAME'
});

// Load a user's NFTs
const userNFTs = await entireSDK.getUserNFTs('WALLET_ADDRESS');

// Load a specific NFT into your scene
const nftLoader = new NFTLoader();
const nftModel = await nftLoader.load(userNFTs[0].modelUrl);

// Add the model to your scene
yourScene.add(nftModel);`}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Documentation
              </Button>
            </CardFooter>
          </Card>

          <Card id="integration-guide">
            <CardHeader>
              <Badge className="w-fit mb-2">Guide</Badge>
              <CardTitle>Integration Guide</CardTitle>
              <CardDescription>
                Step-by-step instructions for integrating ENTIRE's fashion NFTs into your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">1. Register Your Platform</h3>
                <p className="text-muted-foreground">
                  Register your metaverse platform or game with ENTIRE to receive an API key and access to the developer
                  portal.
                </p>
                <Button variant="outline">Register Platform</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">2. Install the SDK</h3>
                <p className="text-muted-foreground">
                  Install the ENTIRE SDK using npm, yarn, or pnpm and initialize it with your API key.
                </p>
                <div className="p-4 font-mono text-sm bg-muted rounded-lg overflow-x-auto">
                  <pre>{`npm install @entire/metaverse-sdk`}</pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">3. Implement User Authentication</h3>
                <p className="text-muted-foreground">
                  Allow users to connect their wallets to verify ownership of their fashion NFTs.
                </p>
                <div className="p-4 font-mono text-sm bg-muted rounded-lg overflow-x-auto">
                  <pre>
                    {`import { EntireAuth } from '@entire/metaverse-sdk';

const auth = new EntireAuth();
const user = await auth.connectWallet();`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">4. Load and Render NFTs</h3>
                <p className="text-muted-foreground">
                  Fetch the user's NFTs and render them in your virtual environment.
                </p>
                <div className="p-4 font-mono text-sm bg-muted rounded-lg overflow-x-auto">
                  <pre>
                    {`const userNFTs = await entireSDK.getUserNFTs(user.walletAddress);

// Load the 3D model for a specific NFT
const nftLoader = new NFTLoader();
const nftModel = await nftLoader.load(userNFTs[0].modelUrl);

// Add the model to your avatar or scene
yourAvatarSystem.wearItem(nftModel);`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">5. Test and Deploy</h3>
                <p className="text-muted-foreground">
                  Test the integration in your development environment and deploy to production when ready.
                </p>
                <Button>View Testing Guide</Button>
              </div>
            </CardContent>
          </Card>

          <Card id="api-reference">
            <CardHeader>
              <Badge className="w-fit mb-2">Reference</Badge>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Complete documentation of the ENTIRE API endpoints and SDK methods.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rest-api">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rest-api">REST API</TabsTrigger>
                  <TabsTrigger value="sdk-methods">SDK Methods</TabsTrigger>
                </TabsList>
                <TabsContent value="rest-api" className="space-y-4 pt-4">
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">GET /api/v1/nfts</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Retrieve a list of fashion NFTs owned by a specific wallet address.
                      </p>
                      <Badge variant="outline">Requires Authentication</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">GET /api/v1/nfts/{"{id}"}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Get detailed information about a specific NFT, including metadata and 3D model URLs.
                      </p>
                      <Badge variant="outline">Requires Authentication</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">POST /api/v1/platforms/connect</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Connect a user's wallet to a specific metaverse platform.
                      </p>
                      <Badge variant="outline">Requires Authentication</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">GET /api/v1/platforms/{"{platform_id}"}/nfts</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Get a list of NFTs that a user has connected to a specific platform.
                      </p>
                      <Badge variant="outline">Requires Authentication</Badge>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="sdk-methods" className="space-y-4 pt-4">
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">entireSDK.getUserNFTs(walletAddress)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Retrieves all fashion NFTs owned by the specified wallet address.
                      </p>
                      <Badge variant="outline">Async Method</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">entireSDK.getNFTDetails(nftId)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Gets detailed information about a specific NFT.
                      </p>
                      <Badge variant="outline">Async Method</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">nftLoader.load(modelUrl)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Loads a 3D model from the specified URL and returns a renderable object.
                      </p>
                      <Badge variant="outline">Async Method</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium">entireSDK.connectPlatform(platformId, walletAddress)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Connects a user's wallet to a specific metaverse platform.
                      </p>
                      <Badge variant="outline">Async Method</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full API Documentation
              </Button>
            </CardFooter>
          </Card>

          <Card id="asset-standards">
            <CardHeader>
              <Badge className="w-fit mb-2">Standards</Badge>
              <CardTitle>Asset Standards</CardTitle>
              <CardDescription>
                Technical specifications for fashion NFT assets to ensure cross-platform compatibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">3D Model Format</h3>
                  <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                    <li>glTF 2.0 or GLB (preferred)</li>
                    <li>Maximum 10,000 polygons</li>
                    <li>PBR materials</li>
                    <li>Skeletal animations (if applicable)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Textures</h3>
                  <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                    <li>Maximum 2048x2048 resolution</li>
                    <li>PNG or JPG format</li>
                    <li>PBR texture sets (Base Color, Normal, etc.)</li>
                    <li>Optimized file size</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Rigging</h3>
                  <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                    <li>Compatible with standard humanoid rigs</li>
                    <li>Maximum 60 bones</li>
                    <li>Named according to convention</li>
                    <li>Weight painting optimized</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Metadata</h3>
                  <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                    <li>JSON format</li>
                    <li>Required fields: name, description, category</li>
                    <li>Optional fields: attributes, animations</li>
                    <li>Platform-specific overrides</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Conversion Service</h3>
                <p className="text-muted-foreground">
                  ENTIRE provides a conversion service that can automatically adapt your fashion NFTs to meet the
                  requirements of different metaverse platforms. This service handles polygon reduction, texture
                  optimization, and rig compatibility.
                </p>
                <Button className="mt-4">Learn About Conversion Service</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
