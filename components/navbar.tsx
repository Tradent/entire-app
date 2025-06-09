"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Sparkles,
  Layers,
  Users,
  Gamepad2,
  Newspaper,
  Upload,
  Camera,
  Palette,
  ChevronDown,
  Link2,
  Code,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Import the NotificationBell component
import NotificationBell from "@/components/notification-bell"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Replace the navItems and featureLinks arrays with this grouped navigation structure
  const navGroups = [
    {
      name: "Explore",
      items: [
        { name: "Collections", href: "/collections", icon: <Layers className="w-4 h-4" /> },
        { name: "Designers", href: "/designers", icon: <Users className="w-4 h-4" /> },
        { name: "News", href: "/news", icon: <Newspaper className="w-4 h-4" /> },
        {
          name: "Badges",
          href: "/badges",
          icon: <Award className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Create",
      items: [
        { name: "Avatar Builder", href: "/avatar", icon: <Palette className="w-4 h-4" /> },
        { name: "AR Try-On", href: "/ar-try-on", icon: <Camera className="w-4 h-4" /> },
        { name: "Submit", href: "/submit", icon: <Upload className="w-4 h-4" /> },
      ],
    },
    {
      name: "Games",
      items: [
        { name: "Game Integrations", href: "/games", icon: <Gamepad2 className="w-4 h-4" /> },
        { name: "Connect Games", href: "/games/connect", icon: <Link2 className="w-4 h-4" /> },
        { name: "Developer Portal", href: "/developers", icon: <Code className="w-4 h-4" /> },
      ],
    },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        scrolled && "shadow-sm",
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo area */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="relative w-8 h-8 overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-lg">
            <Sparkles className="absolute w-5 h-5 text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ENTIRE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1 md:ml-[70px]">
          {navGroups.map((group) => (
            <DropdownMenu key={group.name}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 px-3 py-2">
                  {group.name}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" alignOffset={-5} className="w-56 mt-2" sideOffset={8}>
                <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.items.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      className={cn("flex items-center gap-2", pathname === item.href ? "font-medium" : "")}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:flex">
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Shopping bag - placeholder for marketplace */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <ShoppingBag className="w-5 h-5" />
            <span className="sr-only">Shopping bag</span>
          </Button>

          <NotificationBell />

          <ModeToggle />
          <ConnectWalletButton />

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Search bar - expanded */}
      {isSearchOpen && (
        <div className="container px-4 py-2 mx-auto border-t">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-muted-foreground top-3 left-3" />
            <Input placeholder="Search collections, designers, NFTs..." className="pl-10" autoFocus />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container px-4 py-4 border-t md:hidden">
          <nav className="grid gap-2">
            {navGroups.map((group) => (
              <div key={group.name} className="space-y-2">
                <p className="px-3 text-sm font-medium">{group.name}</p>
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
                {group !== navGroups[navGroups.length - 1] && <div className="my-2 border-t"></div>}
              </div>
            ))}

            <div className="my-2 border-t"></div>

            <div className="relative">
              <Search className="absolute w-4 h-4 text-muted-foreground top-3 left-3" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
