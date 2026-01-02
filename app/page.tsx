'use client'

import { useState, useEffect } from 'react'
import DomainCard from '@/components/DomainCard'
import DomainModal from '@/components/DomainModal'

interface Domain {
  id: number
  name: string
  price: string
  tld: string
  featured: boolean
  category: string
  gradient: string
  logo?: string | null
}

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState<Domain | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/domains')
      .then(res => res.json())
      .then(data => setDomains(data.domains))
      .catch(err => console.error('Error loading domains:', err))
  }, [])

  const filteredDomains = domains.filter(domain => {
    const matchesFilter = filter === 'all' || 
      (filter === 'featured' && domain.featured) || 
      domain.category === filter
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const categories = ['all', 'featured', ...Array.from(new Set(domains.map(d => d.category)))]
  const featuredCount = domains.filter(d => d.featured).length

  return (
    <main className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className="gradient-bg"></div>
      <div className="gradient-overlay"></div>
      <div className="stars" aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-30 card-noise" />

      {/* Content */}
      <div className="relative z-10">
        <DomainModal
          open={modalOpen}
          domain={selected}
          onClose={() => {
            setModalOpen(false)
            setSelected(null)
          }}
        />

        {/* Header */}
        <header className="container mx-auto px-4 pt-10 pb-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-500" />
              <span className="text-sm text-white/70">Premium domains • curated</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight glow-text">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-sky-300">
                NameClutch
              </span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/70">
              A modern collection of brandable domains — clean, memorable, and ready for your next build.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10 text-sm text-white/70">
                <span className="text-white/90 font-semibold">{domains.length}</span> domains
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10 text-sm text-white/70">
                <span className="text-white/90 font-semibold">{featuredCount}</span> featured
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="container mx-auto px-4 py-6">
          <div className="glass rounded-3xl p-5 md:p-6 space-y-5">
            {/* Search bar */}
            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 focus:border-transparent transition-all"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    filter === category
                      ? 'bg-white/10 text-white ring-1 ring-white/20'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 ring-1 ring-white/10'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Domain grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredDomains.map(domain => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onOpenDetails={(d) => {
                  setSelected(d)
                  setModalOpen(true)
                }}
              />
            ))}
          </div>

          {filteredDomains.length === 0 && (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-xl text-white/60">No domains found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8">
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-white/55">
              © 2026 NameClutch. All domains available for purchase.
            </p>
            <p className="text-sm text-white/40 mt-2">
              Contact us for inquiries and custom offers
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
