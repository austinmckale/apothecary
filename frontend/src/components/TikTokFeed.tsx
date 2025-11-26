'use client';

import { useEffect } from 'react';

export default function TikTokFeed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Social</p>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Fresh from TikTok</h2>
        </div>
        <a
          href="https://www.tiktok.com/@alivias.apothecary"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-900 hover:text-white"
        >
          Follow @alivias.apothecary
        </a>
      </div>

      <div className="flex justify-center">
        <blockquote
          className="tiktok-embed"
          cite="https://www.tiktok.com/@alivias.apothecary"
          data-unique-id="alivias.apothecary"
          data-embed-type="creator"
          style={{ maxWidth: '780px', minWidth: '288px' }}
        >
          <section>
            <a target="_blank" href="https://www.tiktok.com/@alivias.apothecary?refer=embed">
              @alivias.apothecary
            </a>
          </section>
        </blockquote>
      </div>
    </section>
  );
}

