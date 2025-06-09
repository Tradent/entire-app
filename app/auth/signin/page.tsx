"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const { connected } = useWallet()
  const { isAuthenticated, signIn, isLoading, error } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile")
    }
  }, [isAuthenticated, router])

  const handleSignIn = async () => {
    if (connected) {
      const success = await signIn()
      if (success) {
        router.push("/profile")
      }
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12 mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Sign In with Wallet</CardTitle>
          </div>
          <CardDescription>
            Connect your Solana wallet to access your ENTIRE profile and digital fashion collection.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="p-6 text-center border rounded-lg bg-muted/20">
            <h3 className="mb-2 text-lg font-medium">Why connect your wallet?</h3>
            <ul className="text-sm text-muted-foreground">
              <li>• Access your digital fashion collection</li>
              <li>• Buy, sell, and trade fashion NFTs</li>
              <li>• Showcase your style in the metaverse</li>
              <li>• Earn exclusive badges and rewards</li>
            </ul>
          </div>

          <div className="flex flex-col items-center w-full gap-4">
            <WalletMultiButton className="wallet-adapter-button-custom" />

            {connected && (
              <Button onClick={handleSignIn} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In with Connected Wallet"
                )}
              </Button>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col text-center border-t">
          <p className="text-xs text-muted-foreground">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
