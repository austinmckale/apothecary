'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { signOutAction } from "@/lib/auth/actions";
import PwaInstallHint from "@/components/admin/PwaInstallHint";

type AdminShellProps = {
  children: ReactNode;
  userEmail: string;
};

const navItems = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Plants", href: "/admin/plants", icon: "🌱" },
  { label: "Orders", href: "/admin/orders", icon: "🧾" },
  { label: "Gallery", href: "/admin/gallery", icon: "🖼️" },
  { label: "Timelapse", href: "/admin/timelapse", icon: "📷" },
  { label: "Social", href: "/admin/social", icon: "📣" },
  { label: "Guides", href: "/admin/guides", icon: "📚" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <aside className="hidden w-72 flex-col border-r border-white/20 bg-slate-950/95 px-6 py-8 text-sm text-white lg:flex">
          <div className="mb-8 space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Libby&apos;s</p>
            <p className="text-xl font-semibold">Admin Console</p>
            <p className="text-xs text-white/60">Mobile-first control center</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-200'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto">
            <PwaInstallHint />
          </div>
        </aside>

        <div className="flex w-full flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Libby&apos;s Aroid Apothecary
                </p>
                <h1 className="text-2xl font-semibold text-slate-950">Admin Dashboard</h1>
              </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden text-slate-500 md:block">{userEmail}</div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-slate-200 px-4 py-1.5 font-medium text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
              >
                Sign out
              </button>
            </form>
          </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[90%] max-w-xl items-center justify-between rounded-3xl border border-slate-200 bg-white/95 px-4 py-2 text-xs shadow-2xl shadow-slate-400/30 lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-1 ${
                isActive ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


