"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import type { PublicKey } from "@solana/web3.js"
import bs58 from "bs58"
import nacl from "tweetnacl"

interface AuthContextType {
  isAuthenticated: boolean
  publicKey: PublicKey | null
  signIn: () => Promise<boolean>
  signOut: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, signMessage, disconnect, connected } = useWallet()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already authenticated on wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      const storedAuthData = localStorage.getItem(`entire_auth_${publicKey.toString()}`)
      if (storedAuthData) {
        try {
          const authData = JSON.parse(storedAuthData)
          const currentTime = Date.now()
          if (authData.expiresAt > currentTime) {
            setIsAuthenticated(true)
            return
          } else {
            // Clear expired auth data
            localStorage.removeItem(`entire_auth_${publicKey.toString()}`)
          }
        } catch (e) {
          console.error("Failed to parse stored auth data", e)
        }
      }
    }
  }, [connected, publicKey])

  // Clear authentication when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setIsAuthenticated(false)
    }
  }, [connected])

  const signIn = async (): Promise<boolean> => {
    if (!publicKey || !signMessage) {
      setError("Wallet not connected")
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      // Create a challenge message with timestamp to prevent replay attacks
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with ENTIRE Fashion Magazine\nTimestamp: ${Date.now()}`,
      )

      // Request signature from the wallet
      const signature = await signMessage(message)

      // Verify the signature (in a real app, this would be done server-side)
      const verified = nacl.sign.detached.verify(message, signature, publicKey.toBytes())

      if (verified) {
        // Store authentication data
        const authData = {
          publicKey: publicKey.toString(),
          signature: bs58.encode(signature),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }
        localStorage.setItem(`entire_auth_${publicKey.toString()}`, JSON.stringify(authData))
        setIsAuthenticated(true)
        return true
      } else {
        setError("Signature verification failed")
        return false
      }
    } catch (err) {
      console.error("Authentication error:", err)
      setError(err instanceof Error ? err.message : "Failed to authenticate")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    if (publicKey) {
      localStorage.removeItem(`entire_auth_${publicKey.toString()}`)
    }
    setIsAuthenticated(false)
    disconnect()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        publicKey,
        signIn,
        signOut,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
