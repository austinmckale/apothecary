import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-emerald-100">
                 <img src="/logo.png" alt="Logo" className="h-full w-full object-cover opacity-80" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-100">
                Alivia&apos;s Apothecary
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              A small-batch aroid studio in Reading, PA. Growing rare Syngoniums, Alocasias, and Begonias with intention and care.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/plants" className="hover:text-emerald-400">
                  Plant Catalog
                </Link>
              </li>
              <li>
                <Link href="/timelapse" className="hover:text-emerald-400">
                  Greenhouse Feed
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-emerald-400">
                  Care Guides
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-emerald-400">
                  Merch & Pots
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a href="https://www.tiktok.com/@alivias.apothecary" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=61568580536897" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400">
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.651-2.797 3.599v2.032h5.44l-.527 3.667h-4.913v7.98H9.101Z" />
                   </svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="mailto:hello@aliviasapothecary.com" className="hover:text-emerald-400">
                  hello@aliviasapothecary.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Alivia&apos;s Apothecary. All rights reserved. Reading, PA.
        </div>
      </div>
    </footer>
  );
}

