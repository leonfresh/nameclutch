"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface Domain {
  id: number;
  name: string;
  price: string;
  tld: string;
  featured: boolean;
  category: string;
  gradient: string;
  logo?: string | null;
}

interface DomainCardProps {
  domain: Domain;
  onOpenDetails?: (domain: Domain) => void;
}

export default function DomainCard({ domain, onOpenDetails }: DomainCardProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [shouldLoadLogo, setShouldLoadLogo] = useState(false);
  const tiltRef = useRef<HTMLButtonElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setLogoFailed(false);
    setLogoLoaded(false);
    setShouldLoadLogo(false);

    if (!domain.logo) return;

    const w = window as unknown as {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => setShouldLoadLogo(true), {
        timeout: 800,
      });
    } else {
      timeoutId = window.setTimeout(() => setShouldLoadLogo(true), 50);
    }

    return () => {
      if (idleId != null && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [domain.logo]);

  const initials = useMemo(() => {
    const base = domain.name.split(".")[0] ?? domain.name;
    return base.slice(0, 2).toUpperCase();
  }, [domain.name]);

  const siteHref = useMemo(() => `https://${domain.name}`, [domain.name]);

  const onPointerMove = (e: React.PointerEvent) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    // Rotate around center: subtle, premium.
    const rotateY = (px - 0.5) * 26;
    const rotateX = (0.5 - py) * 20;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${rotateX}deg`);
      el.style.setProperty("--ry", `${rotateY}deg`);
      el.style.setProperty("--mx", `${Math.round(px * 100)}%`);
      el.style.setProperty("--my", `${Math.round(py * 100)}%`);
    });
  };

  const onPointerLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  return (
    <article className="card-surface group rounded-3xl p-5">
      <button
        type="button"
        onClick={() => onOpenDetails?.(domain)}
        ref={tiltRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="tilt-card relative w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 text-left"
        aria-label={`Open details for ${domain.name}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-20`}
        />

        <div className="tilt-inner relative flex h-36 items-center justify-center">
          {!!domain.logo && shouldLoadLogo && !logoFailed ? (
            <>
              <img
                src={domain.logo}
                alt={`${domain.name} logo`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  logoLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                decoding="async"
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoFailed(true)}
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
            </>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <span className="text-lg font-semibold tracking-wide text-white/90">
                {initials}
              </span>
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
            <div className="text-xs uppercase tracking-wider text-white/50">
              Asking
            </div>
            <div className="text-xl font-semibold text-white">
              {domain.price}
            </div>
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
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
  );
}
