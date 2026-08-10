// AI Stylist integration. Uses Gemini Flash via plain fetch when an API key is
// configured (EXPO_PUBLIC_GEMINI_API_KEY), otherwise falls back to a local
// editorial-style generator so the flow stays fully testable in Expo Go offline.
//
// Both paths return EXACTLY one cohesive outfit: a mandatory top + bottom
// pairing, plus an optional outerwear/layer and a best-effort footwear/
// accessory piece — resolved back to the caller's own wardrobe items (with
// imageUri) by ID, never invented. An outfit is never returned with only a
// single item: if the wardrobe can't supply both a top and a bottom, the
// service reports that explicitly instead of faking a pairing.

import { occasionLabel } from "../constants/occasions";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SLOTS = ["top", "bottom", "outerwear", "footwear"];
const NEUTRAL_COLORS = ["black", "white", "ivory", "beige", "tan", "grey", "gray", "navy", "brown", "charcoal", "cream", "stone", "khaki"];

function categorizeItem(item) {
  const text = `${item.category ?? ""} ${item.name ?? ""}`.toLowerCase();
  if (/dress|gown|jumpsuit|abaya|kaftan/.test(text)) return "onepiece";
  if (/jacket|coat|blazer|cardigan|shrug|outerwear|layer|shawl|waistcoat/.test(text)) return "outerwear";
  if (/shoe|heel|sandal|sneaker|boot|loafer|footwear|flat|mule|khussa|bag|clutch|jewelry|jewellery/.test(text))
    return "footwear";
  if (/pant|trouser|jean|skirt|shalwar|bottom|palazzo|capri|shorts/.test(text)) return "bottom";
  if (/shirt|t-shirt|tshirt|tee|top|blouse|kurta|tunic|sweater|polo/.test(text)) return "top";
  return "top";
}

function bucketWardrobe(clothesList) {
  const buckets = { onepiece: [], top: [], bottom: [], outerwear: [], footwear: [] };
  for (const item of clothesList) {
    buckets[categorizeItem(item)].push(item);
  }
  return buckets;
}

function pickRandom(list) {
  if (!list || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

/** Scores how well a bottom pairs with a given top for the occasion — style/color/formality. */
function compatibilityScore(top, bottom, occasion) {
  const topColor = (top.color ?? "").trim().toLowerCase();
  const bottomColor = (bottom.color ?? "").trim().toLowerCase();
  let score = 0;

  if (NEUTRAL_COLORS.includes(topColor) || NEUTRAL_COLORS.includes(bottomColor)) score += 2;
  if (topColor && topColor === bottomColor) score += 1;
  if (top.season === bottom.season || top.season === "All Season" || bottom.season === "All Season") score += 1;
  if (occasion === "FORMAL" && NEUTRAL_COLORS.includes(bottomColor)) score += 1;
  if (occasion === "CASUAL" || occasion === "WEEKEND") score += 0.5; // casual pairings are more forgiving

  return score;
}

/** Picks the bottom that best matches `top` for the occasion, with light randomness among close ties. */
function pickBestBottomForTop(top, bottomBucket, occasion) {
  if (!bottomBucket || bottomBucket.length === 0) return null;
  if (!top) return pickRandom(bottomBucket);

  const ranked = [...bottomBucket].sort(
    (a, b) => compatibilityScore(top, b, occasion) - compatibilityScore(top, a, occasion)
  );
  const topTierScore = compatibilityScore(top, ranked[0], occasion);
  const contenders = ranked.filter((b) => compatibilityScore(top, b, occasion) === topTierScore);
  return pickRandom(contenders);
}

/**
 * Attempts to build a mandatory top+bottom pairing from the wardrobe buckets.
 * Returns { top, bottom } — either may be null if the wardrobe genuinely
 * lacks that garment type, which the caller must treat as an incomplete outfit.
 */
function pairTopAndBottom(buckets, occasion) {
  const top = pickRandom(buckets.top);
  const bottom = pickBestBottomForTop(top, buckets.bottom, occasion);
  return { top, bottom };
}

function missingSlotsMessage(top, bottom) {
  if (!top && !bottom) {
    return "Add a top (shirt, kurta, tee) and a bottom (trousers, jeans, shorts) to your archive — a curated look needs both pieces to come together.";
  }
  if (!top) {
    return "Add a top (shirt, kurta, tee) to your archive to complete this pairing — you already have the bottom half sorted.";
  }
  return "Add a bottom (trousers, jeans, shorts) to your archive to complete this pairing — you already have the top half sorted.";
}

function buildIncompleteOutfit(occasion, top, bottom) {
  return {
    title: "Almost There",
    occasion: occasionLabel(occasion),
    outfit: { top: null, bottom: null, outerwear: null, footwear: null },
    stylingTip: missingSlotsMessage(top, bottom),
    incomplete: true,
    source: "offline",
  };
}

function buildPrompt(clothesList, occasion) {
  const wardrobeText = clothesList
    .map((item) => `- id: ${item.id} | ${item.name} | category: ${item.category} | color: ${item.color} | season: ${item.season}`)
    .join("\n");

  return `You are a luxury fashion stylist for MeraWardrobe, a Pakistani wardrobe app.
The user is dressing for: "${occasionLabel(occasion)}".

From the wardrobe below, choose EXACTLY ONE cohesive outfit combination for this occasion. A complete outfit is MANDATORY — never respond with only one item:
- 1 Top (shirt, t-shirt, kurta, blouse, sweater — REQUIRED, never null)
- 1 Bottom (pants, jeans, trousers, shorts, skirt — REQUIRED, never null)
- 1 Outerwear/Layer (optional — null if none suits the occasion)
- 1 Footwear/Accessory (include if the wardrobe has one that fits)

The Top and Bottom MUST match each other in style, color, and formality for the occasion (e.g. tailored neutral pieces for Work/Formal, relaxed and playful for Casual/Weekend). Do not select a one-piece dress/jumpsuit as a substitute for a top+bottom pair — only choose from items that are genuinely separate top and bottom garments.

Only choose items from this exact wardrobe, referencing them by their id field:
${wardrobeText}

Respond in strict JSON, no markdown fences, with this exact shape:
{
  "title": "short editorial outfit name",
  "outfitIds": { "top": "id (required)", "bottom": "id (required)", "outerwear": "id or null", "footwear": "id or null" },
  "stylingTip": "exactly 2 sentences of editorial styling advice explaining why the top and bottom work together for the occasion"
}`;
}

function resolveOutfitIds(outfitIds, clothesList) {
  const byId = new Map(clothesList.map((item) => [item.id, item]));
  const outfit = {};
  for (const slot of SLOTS) {
    const id = outfitIds?.[slot];
    outfit[slot] = id ? byId.get(id) ?? null : null;
  }
  return outfit;
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function localFallbackOutfit(clothesList, occasion) {
  const label = occasionLabel(occasion);
  const buckets = bucketWardrobe(clothesList);
  const { top, bottom } = pairTopAndBottom(buckets, occasion);

  if (!top || !bottom) {
    return buildIncompleteOutfit(occasion, top, bottom);
  }

  const wantsLayer = occasion === "WORK" || occasion === "FORMAL" || Math.random() > 0.5;
  const outerwear = wantsLayer ? pickRandom(buckets.outerwear) : null;
  const footwear = pickRandom(buckets.footwear);

  const pieceNames = [top, bottom, outerwear, footwear].filter(Boolean).map((p) => p.name);

  return {
    title: `The ${top.color} Edit`,
    occasion: label,
    outfit: { top, bottom, outerwear, footwear },
    stylingTip: `A considered pairing of ${pieceNames.join(", ")} — tonal, editorial, and built for ${label.toLowerCase()}. Layer with confidence and let the silhouette do the talking.`,
    source: "offline",
  };
}

/**
 * @param {Array<{id: string, name: string, category: string, color: string, season: string, imageUri: string|null}>} clothesList
 * @param {string} occasion - one of the OCCASIONS keys (WORK/CASUAL/FORMAL/WEEKEND)
 * @returns {Promise<{title: string, occasion: string, outfit: {top: object|null, bottom: object|null, outerwear: object|null, footwear: object|null}, stylingTip: string, incomplete?: boolean, source?: string}>}
 */
export async function generateOutfit(clothesList, occasion) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || clothesList.length === 0) {
    return localFallbackOutfit(clothesList, occasion);
  }

  const buckets = bucketWardrobe(clothesList);
  const label = occasionLabel(occasion);

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(clothesList, occasion) }] }],
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty Gemini response");

    const parsed = extractJson(text);
    const outfit = resolveOutfitIds(parsed.outfitIds, clothesList);

    // The AI must pair a top with a bottom. If it left either slot null or
    // hallucinated an id, repair the pairing locally rather than discarding
    // a perfectly good outerwear/footwear pick and styling tip.
    if (!outfit.top || !outfit.bottom) {
      const repaired = pairTopAndBottom(buckets, occasion);
      outfit.top = outfit.top ?? repaired.top;
      outfit.bottom = outfit.bottom ?? repaired.bottom;
    }

    if (!outfit.top || !outfit.bottom) {
      return buildIncompleteOutfit(occasion, outfit.top, outfit.bottom);
    }

    return {
      title: parsed.title || "Curated Look",
      occasion: label,
      outfit,
      stylingTip: parsed.stylingTip || "A cohesive, editorial pairing curated for your day.",
      source: "gemini",
    };
  } catch (err) {
    console.warn("[geminiService] falling back to offline stylist:", err.message);
    return localFallbackOutfit(clothesList, occasion);
  }
}
