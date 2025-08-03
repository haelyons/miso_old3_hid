import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Shield, Eye } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fffdf2" }}>
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <span className="italic text-2xl font-sans">human</span>
          <Switch className="h-4 w-8" defaultChecked />
          <span className="font-bold text-2xl font-sans">mode</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm hover:underline">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm hover:underline">
            How it Works
          </Link>
          <Link href="#contact" className="text-sm hover:underline">
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl mb-4 md:text-5xl font-semibold">
              Certified Human<sup>©</sup>
            </h1>
            <p className="text-lg text-gray-600 mb-12 leading-3">Helping small artisans stand out</p>
          </div>

          {/* Search Interface - Front and Center */}
          <div className="max-w-2xl mx-auto mb-20">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Paste Etsy or RedBubble product URL here"
                className="flex-1 border-2 border-gray-300 focus:border-blue-500 bg-white py-6 px-6 rounded-3xl text-4xl"
              />
              <Button className="bg-gray-800 hover:bg-gray-700 p-6 rounded-full aspect-square">
                <Search className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">We support Etsy, RedBubble, and Alibaba</p>
          </div>
        </div>

        {/* How It Works */}
        <section id="how-it-works" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white border-2 border-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Search</h3>
              </div>
              <p className="text-gray-600">
                Extract product metadata from URLs through database lookup and external API integration. Get seller
                info, images, pricing, and descriptions.
              </p>
            </Card>

            <Card className="p-6 bg-white border-2 border-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Mask</h3>
              </div>
              <p className="text-gray-600">
                Segment product images to isolate items from backgrounds using advanced computer vision. Focus analysis
                on the actual product.
              </p>
            </Card>

            <Card className="p-6 bg-white border-2 border-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Detect</h3>
              </div>
              <p className="text-gray-600">
                Evaluate segmented images for AI generation patterns. Get clear "likely" or "unlikely" results with
                confidence scores.
              </p>
            </Card>
          </div>
        </section>

        {/* Connector */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-full">
            <div className="w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-white"></div>
          </div>
        </div>

        {/* Product Demo - What We're Building Toward */}
        <section className="text-center mb-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between bg-black text-white px-4 py-2">
                <p className="text-sm font-bold tracking-wide">Product Analysis</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs">human</span>
                  <Switch className="h-3 w-6" defaultChecked />
                  <span className="text-xs font-bold">mode</span>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Luna Arcana Tarot Deck</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Certified Human©
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Luna Arcana Tarot — 78‑Card Deck</h3>
                <p className="text-sm mb-6 text-gray-600">
                  Hand‑illustrated major & minor arcana with gilded edges & guidebook.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">Original Artwork</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        94% confidence — unique illustration hashes & zero stock‑art matches
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">Indie Printed • First Edition</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-600">Printed by Starlith Print House – Nottingham, UK</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">Locally Sourced</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-600">FSC paper • Somerset Paper Mill (120 km)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-emerald-600 rounded-sm"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">Eco‑Footprint</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-600">Total 0.50 kg CO₂ / deck • Plastic‑free mailer</p>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="border-t pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    LA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Luna Arcana Studio</p>
                    <p className="text-xs text-gray-600">Devon, UK • Est. 2021 • 812 sales • ★4.95</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative bg-green-50 text-gray-700 text-sm rounded-lg p-4 mt-4 mb-4">
                  <div className="absolute -top-2 left-6 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-green-50"></div>
                  <p>
                    <strong className="text-green-700">This seller says:</strong> "Our tarot illustrations draw on
                    centuries‑old esoteric traditions, infused with modern folk symbolism..."
                  </p>
                </div>

                <p className="text-center text-xs text-gray-500 mb-4">
                  This is a demonstration of our final MVP - comprehensive product authenticity analysis
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Try Certified Human© */}
        <section className="text-center mb-20">
          <div className="bg-white border-2 border-black p-12 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Try Certified Human©</h2>
            <p className="text-lg text-gray-600 mb-8">
              Try the observability layer for human e-commerce, launching in Q4 2025
            </p>
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Paste your product URL here"
                className="flex-1 border-2 border-gray-300 focus:border-blue-500 text-xl py-4 px-6 rounded-xl"
              />
              <Button className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl">Analyze</Button>
            </div>
            <p className="text-sm text-gray-500">Instant analysis • Progressive feedback • Clear results</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg italic">human</span>
                <Switch className="h-4 w-8" />
                <span className="text-lg font-bold">mode</span>
              </div>
              <p className="text-gray-600">Building tools for people</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Supported Platforms</h3>
              <p className="text-gray-600">We support Etsy, RedBubble, and Alibaba</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-600">
                <Link href="mailto:hello@humanmode.id" className="hover:underline">
                  hello@humanmode.id
                </Link>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Human Mode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
