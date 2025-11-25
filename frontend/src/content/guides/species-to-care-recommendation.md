# Species → Care Recommendation Logic — Alivia’s Apothecary

This document is for the **backend / app logic** side of Alivia’s Apothecary.  
It outlines how to map a species (or genus) to recommended light, water, and environmental parameters in a structured, future-proof way.

---

## 1. Goal

Given:

- A species name (or genus)
- Age/stage (e.g., corm, juvenile, mature)
- Growing context (window, grow light, cabinet, etc.)

Return:

- Target **PPFD and DLI ranges**
- Recommended **watering behavior**
- **Mix type** (soil / semi-hydro)
- **Temperature / humidity bands**
- Notes on **pest sensitivity**, **dormancy tendencies**, and **variegation care** if relevant

---

## 2. Data Model (Conceptual)

### 2.1. `species` table

- `id`
- `scientific_name`
- `common_name`
- `genus`
- `growth_form` (e.g. corm, rhizome, vine, rosette)
- `notes`

### 2.2. `care_profiles` table

- `id`
- `species_id` (nullable if genus-level)
- `genus` (for generic profiles)
- `stage` (e.g. `corm`, `juvenile`, `adolescent`, `mature`)
- `ppfd_min`
- `ppfd_max`
- `dli_min`
- `dli_max`
- `watering_notes`
- `substrate_profile` (reference to mix recipe or enum)
- `temp_min`
- `temp_max`
- `humidity_min`
- `humidity_max`
- `pest_risk_notes`
- `dormancy_notes`
- `variegation_notes` (if applicable)

---

## 3. Example Entries

### 3.1. Generic Alocasia (juvenile)

```json
{
  "genus": "Alocasia",
  "stage": "juvenile",
  "ppfd_min": 60,
  "ppfd_max": 120,
  "dli_min": 8,
  "dli_max": 16,
  "substrate_profile": "alocasia_airmix",
  "temp_min": 20,
  "temp_max": 27,
  "humidity_min": 55,
  "humidity_max": 75,
  "watering_notes": "Let top 2–3 cm dry, keep core lightly moist, avoid cold + wet.",
  "pest_risk_notes": "Higher spider mite risk in dry air; monitor underside of leaves.",
  "dormancy_notes": "May slow or drop leaves in low light or cooler seasons; maintain slightly moist substrate for corm."
}
```

### 3.2. Variegated Syngonium (mature climbing)

```json
{
  "genus": "Syngonium",
  "stage": "mature",
  "ppfd_min": 120,
  "ppfd_max": 200,
  "dli_min": 10,
  "dli_max": 20,
  "substrate_profile": "syngonium_roidmix",
  "temp_min": 20,
  "temp_max": 27,
  "humidity_min": 45,
  "humidity_max": 70,
  "watering_notes": "Top 1–3 cm dry between waterings; monitor moss pole moisture separately if used.",
  "variegation_notes": "Higher PPFD supports variegation; avoid direct sun on white sectors to prevent burn."
}
```

---

## 4. Application Logic (High-Level)

When user selects or the app identifies a species:

1. **Attempt species-level match** in `care_profiles`.
2. If not found, fall back to **genus-level profile**.
3. Use **stage** to refine values:
   - corm/prop
   - juvenile
   - adolescent
   - mature

4. If user provides **environment context** (e.g. “east window,” “grow shelf with light X”), the app can:
   - Compare measured/estimated PPFD with recommended range.
   - Suggest:
     - Move closer/farther from light
     - Change shelf
     - Adjust duration of light exposure

---

## 5. UI Ideas for the Recommendation Page

### 5.1. Input section

- Drop-down or search for:
  - Species / genus
- Stage selector:
  - Corm / cutting
  - Small plant
  - Established plant
- Environment selector:
  - Window direction (N/E/S/W)
  - Distance from window
  - Grow light vs natural light
- Optional: user inputs lux / PPFD reading.

### 5.2. Output section

- **Light recommendation:**
  - Recommended PPFD & DLI
  - Simple text: “Medium-bright indirect” + explanation
- **Water rhythm guidance:**
  - “Expect to water every X–Y days under current conditions” (approximate)
- **Environment summary:**
  - Target temp/humidity bands
  - Warnings about cold + wet or very dry conditions

### 5.3. Actionable tips

- “Move 30–60 cm closer to window for ideal light.”
- “Consider a grow light if maximum lux is below X.”
- “Increase aeration in soil if drying takes more than N days.”

---

## 6. Integration with AI/LLM

Future option:

- When a new, unmodeled species is added:
  - Use an LLM prompt with genus, habitat info, and similar species profiles to propose a **draft care profile**.
  - Human or admin confirms or edits, then saves into `care_profiles`.

This allows rapid expansion of coverage while keeping you in control of final recommendations.

---

## 7. Affiliate / Monetization Tie-ins

Based on care recommendations, the app can gently suggest:

- `[[AffiliateLink: Recommended Grow Light]]` when PPFD is insufficient.
- `[[AffiliateLink: Aroid Mix Base]]` if substrate profile is mismatched.
- `[[AffiliateLink: Humidifier]]` if humidity is below recommended.

These links can be inserted conditionally into the recommendation output.

---
