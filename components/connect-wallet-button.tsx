"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAuth } from "@/context/auth-context"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Link from "next/link"

export function ConnectWalletButton() {
  const [open, setOpen] = useState(false)
  const { connected, publicKey } = useWallet()
  const { isAuthenticated, signIn, signOut } = useAuth()

  const handleSignIn = async () => {
    if (connected) {
      await signIn()
      setOpen(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="w-4 h-4" />
          {isAuthenticated ? "Connected" : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isAuthenticated ? "Wallet Connected" : "Connect Your Wallet"}</DialogTitle>
          <DialogDescription>
            {isAuthenticated
              ? "Your wallet is connected to ENTIRE magazine."
              : "Connect your Solana wallet to browse and collect digital fashion NFTs."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 mt-4 space-y-4 border rounded-lg">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-2 overflow-hidden text-sm bg-muted rounded-md">
                <p className="font-mono truncate">{publicKey?.toString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  <Button className="w-full">View Profile</Button>
                </Link>
                <Button variant="destructive" onClick={handleSignOut} className="w-full">
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <WalletMultiButton className="wallet-adapter-button-custom w-full" />
              {connected && (
                <Button onClick={handleSignIn} className="w-full">
                  Sign In with Connected Wallet
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
