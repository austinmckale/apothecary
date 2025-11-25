export type Plant = {
  id: string;
  name: string;
  slug: string;
  species: string | null;
  cultivar: string | null;
  light_requirements: string | null;
  water_schedule: string | null;
  temperature_range: string | null;
  humidity_range: string | null;
  description: string | null;
  care_notes: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type PlantPhoto = {
  id: string;
  plant_id: string;
  storage_path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  captured_at: string;
  is_cover: boolean;
  created_at: string;
};

export type PlantWithPhotos = Plant & {
  plant_photos?: PlantPhoto[];
};


