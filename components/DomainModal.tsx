'use client'

import React, { useEffect, useMemo } from 'react'

type Domain = {
  id: number
  name: string
  price: string
  tld: string
  featured: boolean
  category: string
  gradient: string
  logo?: string | null
}

function scoreName(name: string) {
  const base = (name.split('.')[0] ?? name).replace(/[^a-z0-9]/gi, '')
  const len = base.length
  const vowelCount = (base.match(/[aeiou]/gi) ?? []).length
  const hasDouble = /(.)\1/.test(base.toLowerCase())

  const brevity = Math.max(0, 12 - len)
  const pronounce = Math.min(10, Math.round((vowelCount / Math.max(1, len)) * 20))
  const brand = Math.min(10, 6 + (hasDouble ? 1 : 0) + (len <= 10 ? 3 : 1))

  return {
    base,
    len,
    brevity,
    pronounce,
    brand,
  }
}

function generatePitch(domain: Domain) {
  const { base, len, brevity, pronounce, brand } = scoreName(domain.name)
  const lower = base.toLowerCase()

  const angle = (() => {
    if (domain.category.toLowerCase().includes('finance')) return 'trust + authority'
    if (domain.category.toLowerCase().includes('design')) return 'creative edge'
    if (domain.category.toLowerCase().includes('ai')) return 'future-proof signal'
    if (domain.category.toLowerCase().includes('tech')) return 'product-first credibility'
    return 'brandable clarity'
  })()

  const hooks: string[] = []
  if (len <= 10) hooks.push('Short enough for logos, app icons, and voice search.')
  if (domain.tld === '.com') hooks.push('The .com gives instant legitimacy.')
  if (domain.tld === '.com.au') hooks.push('Perfect for an AU-first brand with local trust.')
  if (domain.tld === '.work') hooks.push('Modern + maker-friendly for a new-age brand.')
  if (lower.includes('ai')) hooks.push('Contains “AI” for instant category recognition.')

  const suggestedUses = (() => {
    if (domain.category.toLowerCase().includes('finance')) return ['Fintech app', 'Credit scoring', 'Billing platform']
    if (domain.category.toLowerCase().includes('design')) return ['Studio site', 'SaaS design system', 'Agency rebrand']
    if (domain.category.toLowerCase().includes('digital')) return ['Digital agency', 'Marketing consultancy', 'Productized service']
    if (domain.category.toLowerCase().includes('brand')) return ['Consumer brand', 'Creator brand', 'Community project']
    if (domain.category.toLowerCase().includes('premium')) return ['Holding brand', 'Marketplace', 'Flagship product']
    return ['Startup', 'SaaS', 'Newsletter']
  })()

  return {
    headline: `${domain.name} — ${angle}`,
    subhead:
      `A clean, memorable name positioned for ${domain.category}. Strong visual balance and easy recall — ideal for a serious build.`,
    bullets: [
      `Brandability score: ${brand}/10 • Pronounceability: ${pronounce}/10 • Brevity: ${brevity}/10`,
      `Great for: ${suggestedUses.join(' / ')}`,
      ...hooks.slice(0, 3),
    ],
  }
}

export default function DomainModal({
  open,
  domain,
  onClose,
}: {
  open: boolean
  domain: Domain | null
  onClose: () => void
}) {
  const pitch = useMemo(() => (domain ? generatePitch(domain) : null), [domain])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight

    // Prevent layout shift when the scrollbar disappears.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [open])

  if (!open || !domain || !pitch) return null

  const href = `https://${domain.name}`
  const emailHref = `mailto:leonfreshdesign@gmail.com?subject=${encodeURIComponent(
    `Domain inquiry: ${domain.name}`
  )}&body=${encodeURIComponent(
    `Hi Leon,\n\nI'm interested in ${domain.name} (${domain.price}).\n\nMy offer / questions:\n- \n\nThanks!`
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <button
        className="absolute inset-0 modal-backdrop"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative w-[min(720px,92vw)]">
        <div className="modal-surface rounded-3xl p-6 md:p-7 max-h-[86vh] overflow-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">Domain spotlight</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-white/95 truncate">
                {pitch.headline}
              </h2>
              <p className="mt-3 text-white/70 leading-relaxed">{pitch.subhead}</p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr,220px]">
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm text-white/60">Price</div>
                <div className="mt-1 text-2xl font-semibold text-white">{domain.price}</div>
              </div>

              <ul className="space-y-2">
                {pitch.bullets.map((b) => (
                  <li key={b} className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white/70">
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm text-white/60">Preview</div>
              <div className="mt-3 flex items-center justify-center rounded-2xl bg-black/30 ring-1 ring-white/10 h-28 overflow-hidden">
                {domain.logo ? (
                  <img
                    src={domain.logo}
                    alt={`${domain.name} logo`}
                    className="max-h-16 max-w-[80%] object-contain"
                  />
                ) : (
                  <div className="text-white/60 text-sm">No logo</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
                className="mt-4 w-full neon-cta"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M14 3h7v7m0-7L10 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Inquire
                </span>
              </button>

              <a
                href={emailHref}
                className="mt-2 block text-center rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white/85 hover:bg-white/10"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 6h16v12H4V6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m4 7 8 6 8-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Email
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -inset-2 -z-10 blur-2xl opacity-60" aria-hidden>
          <div className={`h-full w-full rounded-[28px] bg-gradient-to-r ${domain.gradient}`} />
        </div>
      </div>
    </div>
  )
}
