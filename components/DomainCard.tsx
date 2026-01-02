
'use client'

import React, { useMemo, useState } from 'react'

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

interface DomainCardProps {
  domain: Domain
  onOpenDetails?: (domain: Domain) => void
}

export default function DomainCard({ domain, onOpenDetails }: DomainCardProps) {
  const [logoFailed, setLogoFailed] = useState(false)

  const initials = useMemo(() => {
    const base = domain.name.split('.')[0] ?? domain.name
    return base.slice(0, 2).toUpperCase()
  }, [domain.name])

  const siteHref = useMemo(() => `https://${domain.name}`, [domain.name])

  return (
    <article className="card-surface group rounded-3xl p-5">
      <button
        type="button"
        onClick={() => onOpenDetails?.(domain)}
        className="relative w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 text-left"
        aria-label={`Open details for ${domain.name}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-25`} />
        <div className="absolute inset-0 card-noise opacity-40" />

        <div className="relative flex h-32 items-center justify-center">
          {domain.featured && (
            <div className="absolute left-3 top-3">
              <span className="featured-pill">
                <span className="inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 2l1.6 5.1L19 9l-5.4 1.9L12 16l-1.6-5.1L5 9l5.4-1.9L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Featured
                </span>
              </span>
            </div>
          )}

          {!!domain.logo && !logoFailed ? (
            <img
              src={domain.logo}
              alt={`${domain.name} logo`}
              className="max-h-16 max-w-[75%] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
              loading="lazy"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <span className="text-lg font-semibold tracking-wide text-white/90">{initials}</span>
            </div>
          )}
        </div>
      </button>

      <div className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onOpenDetails?.(domain)}
              className="block w-full text-left truncate text-[18px] font-semibold text-white/95 hover:text-white"
              aria-label={`Open details for ${domain.name}`}
            >
              {domain.name}
            </button>
            <p className="mt-1 text-sm text-white/60">{domain.category}</p>
          </div>
          <span className="tld-pill">{domain.tld}</span>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="space-y-0.5">
            <div className="text-xs uppercase tracking-wider text-white/50">Asking</div>
            <div className="text-xl font-semibold text-white">{domain.price}</div>
          </div>

          <a
            href={siteHref}
            target="_blank"
            rel="noreferrer"
            className="cta-pill"
            aria-label={`Visit ${domain.name}`}
          >
            <span className="inline-flex items-center gap-2">
              Inquire
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M14 3h7v7m0-7L10 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </article>
  )
}
