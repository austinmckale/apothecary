export type FeaturedPlant = {
  name: string;
  category: "Syngonium" | "Alocasia" | "Begonia";
  stage: "Corm" | "Pup" | "Juvenile" | "Mature";
  rootStatus: "Unrooted" | "Lightly rooted" | "Rooted";
  price: number;
  tags: string[];
  image: string;
  description: string;
};

export const featuredPlants: FeaturedPlant[] = [
  {
    name: "Syngonium Albo Node Set",
    category: "Syngonium",
    stage: "Pup",
    rootStatus: "Lightly rooted",
    price: 165,
    tags: ["Variegated", "New this week"],
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60",
    description:
      "Vining cutting with crisp white variegation, acclimated on sphagnum and ready for a moss pole.",
  },
  {
    name: "Alocasia Dragon Scale Corm",
    category: "Alocasia",
    stage: "Corm",
    rootStatus: "Unrooted",
    price: 95,
    tags: ["Chunky corm", "Limited batch"],
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60",
    description:
      "Hand-selected corm awakening in our printed self-watering vessel to simplify early growth.",
  },
  {
    name: "Begonia Lux Tiled Veil",
    category: "Begonia",
    stage: "Juvenile",
    rootStatus: "Rooted",
    price: 120,
    tags: ["Living stained glass"],
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=60",
    description:
      "Rhizomatous mix with dramatic iridescence, grown in airy substrate to encourage pattern play.",
  },
  {
    name: "Syngonium Mojito Column",
    category: "Syngonium",
    stage: "Juvenile",
    rootStatus: "Rooted",
    price: 140,
    tags: ["Treillis ready"],
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60",
    description:
      "Multi-node vine pre-trained on a coco pole with speckled lime variegation and chunky petioles.",
  },
];

