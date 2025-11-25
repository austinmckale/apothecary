import Image from "next/image";
import { TimelapseFrame } from "@/lib/timelapse";

type FrameHeroProps = {
  frame: TimelapseFrame;
};

export function FrameHero({ frame }: FrameHeroProps) {
  const formatted = new Date(frame.captured_at).toLocaleString();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-slate-950/90 text-white shadow-xl">
      <Image
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${frame.storage_path}`}
        alt={`Timelapse frame ${formatted}`}
        width={1600}
        height={900}
        className="h-80 w-full object-cover opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
          {frame.camera_label ?? "Greenhouse camera"}
        </p>
        <h2 className="text-2xl font-semibold">Captured {formatted}</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          {typeof frame.temperature === "number" && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Temp {frame.temperature.toFixed(1)}°F
            </span>
          )}
          {typeof frame.humidity === "number" && (
            <span className="rounded-full bg-white/10 px-3 py-1">{frame.humidity}% RH</span>
          )}
          {typeof frame.moisture === "number" && (
            <span className="rounded-full bg-white/10 px-3 py-1">Moist {frame.moisture.toFixed(1)}%</span>
          )}
          {typeof frame.light_lux === "number" && (
            <span className="rounded-full bg-white/10 px-3 py-1">{Math.round(frame.light_lux)} lux</span>
          )}
        </div>
        {frame.notes && <p className="text-sm text-white/80">{frame.notes}</p>}
      </div>
    </div>
  );
}

