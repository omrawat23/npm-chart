'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const popularPackages = ['solid-js', 'lodash', 'svelte', '@nestjs/core']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/package/${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
        NPM CHART
      </h1>
      <p className="text-muted-foreground mb-8">
        Search for a package to see its download stats over time.
      </p>
      
      <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="npm package"
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {popularPackages.map((pkg) => (
          <button
            key={pkg}
            onClick={() => router.push(`/package/${encodeURIComponent(pkg)}`)}
            className="px-4 py-2 rounded-full bg-secondary text-sm hover:bg-secondary/80 transition-colors"
          >
            {pkg}
          </button>
        ))}
      </div>
    </div>
  )
}

