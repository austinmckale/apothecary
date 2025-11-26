import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-emerald-100">
             {/* Placeholder for logo if needed, or just use text */}
             <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-900">
            Alivia&apos;s Apothecary
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/plants" className="transition hover:text-emerald-600">
            Plants
          </Link>
          <Link href="/timelapse" className="transition hover:text-emerald-600">
            Timelapse
          </Link>
          <Link href="/guides" className="transition hover:text-emerald-600">
            Care Guides
          </Link>
          <Link href="/shop" className="transition hover:text-emerald-600">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://www.tiktok.com/@alivias.apothecary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition hover:text-black"
            aria-label="TikTok"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61568580536897"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition hover:text-blue-600"
            aria-label="Facebook"
          >
             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.651-2.797 3.599v2.032h5.44l-.527 3.667h-4.913v7.98H9.101Z" />
             </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

