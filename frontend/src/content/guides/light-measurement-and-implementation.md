# Light Measurement & Implementation Guide

This section is designed for both growers and your future app features.

---

## 📏 How to Measure Light (Step-by-Step)

### Method 1 — Phone Lux App (Beginner-Friendly)

1. Download any **lux meter** app.  
2. Place your phone where your **leaf sits**, not the pot rim.  
3. Point the top of the phone **straight upward**.  
4. Record:
   - Morning  
   - Midday  
   - Afternoon  

Convert using:

```text
PPFD (µmol/m²/s) ≈ lux ÷ 60–75
```

### Benefits

- Free  
- Fast  
- Good for mapping rooms

### Limitations

- Color spectrum varies  
- More inaccurate with pink/red grow lights  
- Only gives **approximate** plant-light values

---

### Method 2 — PPFD / PAR Meters (Accurate)

Use a quantum sensor or PPFD meter:

1. Hold the sensor at **leaf height**.  
2. Take readings across the shelf.  
3. Average them or record the brightest value (your choice).  

These meters directly show **µmol/m²/s**.

These are the tools used by:

- Professional growers  
- Greenhouses  
- Serious collectors  

---

## 🔮 Light Mapping Ritual (Great for Users & Future App Feature)

1. Pick 3–5 locations for each shelf.  
2. Measure PPFD or lux.  
3. Create a **shelf map** like:

```text
Front Left: 115 PPFD
Front Right: 95 PPFD
Back Left: 70 PPFD
Back Right: 55 PPFD
```

4. Place:
   - Fussier Alocasias → highest consistent PPFD  
   - Syngoniums → mid-range  
   - Cuttings / corms → lower PPFD zones  

Later, your app can automate this mapping.

---

## 🧰 Future Affiliate Sections (Placeholders)

Add these when you’re ready:

### Recommended PPFD Meters

- `[[AffiliateLink: PAR Meter 1]]`
- `[[AffiliateLink: PAR Meter 2]]`

### Recommended Lux Apps

- `[[AffiliateLink: iOS App Name]]`
- `[[AffiliateLink: Android App Name]]`

### Recommended Grow Lights

- `[[AffiliateLink: Light 1]]`
- `[[AffiliateLink: Light 2]]`

### Recommended Stands & Hardware

- `[[AffiliateLink: Adjustable Plant Stand]]`
- `[[AffiliateLink: Full Spectrum Bulb]]`

You can search/replace these tokens with actual links later.

---

## 🧩 How to Integrate This Content Into Your App

### Option A — Static Markdown Pages (Easiest)

Drop these `.md` files into a folder and render them with a Markdown-to-React library:

- `react-markdown`  
- `next-mdx-remote`  
- `contentlayer`

### Option B — Store in Supabase

Later you can store light guides as structured data:

Example schema:

```text
plant_light_guides
- genus
- stage
- ppfd_min
- ppfd_max
- dli_min
- dli_max
- notes
- wavelength_notes
```

### Option C — Component-Based Guides

Convert each section into a React component and reuse across pages.

---

## 🔧 Integration Example (Pseudocode)

You might create a helper in your app like:

```ts
type LightProfile = {
  genus: string;
  stage: "corm" | "juvenile" | "adolescent" | "mature";
  ppfdMin: number;
  ppfdMax: number;
  dliMin: number;
  dliMax: number;
};

function getLightProfile(genus: string, stage: LightProfile["stage"]): LightProfile | null {
  // lookup from static data or Supabase table
}
```

Then use it in your React components to:

- Show numeric targets.
- Render helper text.
- Later: compare measured values vs recommended ranges.

---
