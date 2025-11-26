import HeroSection from "@/components/HeroSection";
import FeaturedCollectionsRow from "@/components/FeaturedCollectionsRow";
import GreenhouseWindow from "@/components/GreenhouseWindow";
import FeaturedPlantsGrid from "@/components/FeaturedPlantsGrid";
import GuidesPreviewGrid from "@/components/GuidesPreviewGrid";
import PublicShell from "@/components/PublicShell";
import TikTokFeed from "@/components/TikTokFeed";
import { featuredPlants } from "@/content/featured-plants";
import { getAllGuides } from "@/lib/guides";
import { getLatestGalleryPhotos } from "@/lib/gallery";

const serviceHighlights = [
  { label: "Small batch greenhouse", detail: "180+ aroids in rotation", icon: "🌿" },
  { label: "Care concierge", detail: "Personalized watering & light plans", icon: "📋" },
  { label: "3D corm vessels", detail: "Self-watering printed pots for rooted babies", icon: "🪄" },
  { label: "Timelapse feed", detail: "Daily uploads from our grow benches", icon: "📷" },
];

const heroStats = [
  { label: "PUPS IN CARE", value: "182" },
  { label: "ALOCASIA CORMS", value: "42" },
  { label: "TIMELAPSE FRAMES/DAY", value: "96" },
];

export default async function Home() {
  const guides = getAllGuides().slice(0, 3);
  const gallery = await getLatestGalleryPhotos(6);

  const greenhouseImages = gallery.map((shot) => ({ src: shot.url, alt: shot.alt ?? shot.title }));

  return (
    <PublicShell>
      <div className="bg-gradient-to-b from-emerald-50 via-lime-50 to-white text-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-12 lg:px-12">
          <HeroSection stats={heroStats} />
          <FeaturedCollectionsRow />

          <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-emerald-50/70 md:grid-cols-4">
            {serviceHighlights.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{item.label}</p>
                <p className="text-sm text-slate-700">{item.detail}</p>
              </div>
            ))}
          </section>

          <GreenhouseWindow liveStreamEnabled={false} liveStreamUrl={null} galleryImages={greenhouseImages} />
          
          <TikTokFeed />

          <FeaturedPlantsGrid plants={featuredPlants} />

          <GuidesPreviewGrid guides={guides} />
        </div>
      </div>
    </PublicShell>
  );
}
