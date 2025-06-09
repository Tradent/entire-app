"use client"

import { useState } from "react"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SmartContractDetailsProps {
  contractAddress: string
  tokenId: string
  blockchain: string
}

export function SmartContractDetails({ contractAddress, tokenId, blockchain }: SmartContractDetailsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getExplorerUrl = () => {
    if (blockchain === "Solana") {
      return `https://explorer.solana.com/address/${contractAddress}`
    }
    return "#"
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Contract Address</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(contractAddress)}>
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy contract address</span>
            </Button>
            <a href={getExplorerUrl()} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-3 w-3" />
                <span className="sr-only">View on explorer</span>
              </Button>
            </a>
          </div>
        </div>
        <div className="p-2 overflow-hidden text-sm bg-muted rounded-md">
          <p className="font-mono truncate">{contractAddress}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Token ID</p>
        <div className="p-2 overflow-hidden text-sm bg-muted rounded-md">
          <p className="font-mono">{tokenId}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Blockchain</p>
        <div className="p-2 overflow-hidden text-sm bg-muted rounded-md">
          <p className="font-mono">{blockchain}</p>
        </div>
      </div>

      <div className="p-3 text-sm border rounded-md bg-muted/50">
        <p>
          This NFT is verified on the {blockchain} blockchain and follows the Metaplex NFT Standard. The smart contract
          ensures royalties are paid to creators on secondary sales.
        </p>
      </div>

      {copied && (
        <div className="fixed bottom-4 right-4 p-2 bg-green-500 text-white rounded shadow-lg">Copied to clipboard!</div>
      )}
    </div>
  )
}
