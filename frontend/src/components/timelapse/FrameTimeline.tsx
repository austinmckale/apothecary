import Image from "next/image";
import { TimelapseFrame } from "@/lib/timelapse";

type Props = {
  frames: TimelapseFrame[];
};

export function FrameTimeline({ frames }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {frames.map((frame) => (
        <div
          key={frame.id}
          className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm shadow-emerald-50 overflow-hidden"
        >
          <div className="relative h-40 w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${frame.storage_path}`}
              alt={`Frame ${frame.captured_at}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
              {frame.camera_label ?? "Cam"}
            </p>
            <p className="text-sm text-slate-600">{new Date(frame.captured_at).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

