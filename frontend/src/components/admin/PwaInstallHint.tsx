'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function PwaInstallHint() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setStatus('Install prompt unavailable in this browser.');
      return;
    }
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setStatus(choice.outcome === 'accepted' ? 'App installed!' : 'Install dismissed.');
      setDeferredPrompt(null);
    } catch {
      setStatus('Unable to trigger install prompt.');
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white/70 p-4 shadow-sm shadow-emerald-100">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-700">Install the admin PWA</p>
        <p className="text-xs text-slate-500">
          Add Libby&apos;s dashboard to your home screen for instant camera uploads and offline
          access.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-500"
          >
            Install
          </button>
          <span className="text-xs text-slate-400">Cmd/Ctrl + Shift + P → &quot;Install&quot;</span>
        </div>
        {status && <p className="text-xs text-emerald-600">{status}</p>}
      </div>
    </div>
  );
}


