// AI Stylist integration. Uses Gemini Flash via plain fetch when an API key is
// configured (EXPO_PUBLIC_GEMINI_API_KEY), otherwise falls back to a local
// editorial-style generator so the flow stays fully testable in Expo Go offline.
//
// Both paths return EXACTLY one cohesive outfit: a top, a bottom, an optional
// outerwear/layer, and a footwear/accessory piece — resolved back to the
// caller's own wardrobe items (with imageUri) by ID, never invented.

import { occasionLabel } from "../constants/occasions";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SLOTS = ["top", "bottom", "outerwear", "footwear"];

function categorizeItem(item) {
  const text = `${item.category ?? ""} ${item.name ?? ""}`.toLowerCase();
  if (/dress|gown|jumpsuit|abaya|kaftan/.test(text)) return "onepiece";
  if (/jacket|coat|blazer|cardigan|shrug|outerwear|layer|shawl|waistcoat/.test(text)) return "outerwear";
  if (/shoe|heel|sandal|sneaker|boot|loafer|footwear|flat|mule|khussa|bag|clutch|jewelry|jewellery/.test(text))
    return "footwear";
  if (/pant|trouser|jean|skirt|shalwar|bottom|palazzo|capri|shorts/.test(text)) return "bottom";
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

function buildPrompt(clothesList, occasion) {
  const wardrobeText = clothesList
    .map((item) => `- id: ${item.id} | ${item.name} | category: ${item.category} | color: ${item.color} | season: ${item.season}`)
    .join("\n");

  return `You are a luxury fashion stylist for MeraWardrobe, a Pakistani wardrobe app.
The user is dressing for: "${occasionLabel(occasion)}".

From the wardrobe below, choose EXACTLY ONE cohesive outfit combination for this occasion:
- 1 Top (or a one-piece dress/jumpsuit used as the top slot, in which case leave bottom null)
- 1 Bottom (null if a one-piece dress/jumpsuit is used as the top)
- 1 Outerwear/Layer (optional — null if none suits the occasion)
- 1 Footwear/Accessory

Only choose items from this exact wardrobe, referencing them by their id field:
${wardrobeText}

Respond in strict JSON, no markdown fences, with this exact shape:
{
  "title": "short editorial outfit name",
  "outfitIds": { "top": "id or null", "bottom": "id or null", "outerwear": "id or null", "footwear": "id or null" },
  "stylingTip": "exactly 2 sentences of editorial styling advice explaining why this combination works for the occasion"
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

function localFallbackOutfit(clothesList, occasion) {
  const label = occasionLabel(occasion);

  if (clothesList.length === 0) {
    return {
      title: "Capsule Essential",
      occasion: label,
      outfit: { top: null, bottom: null, outerwear: null, footwear: null },
      stylingTip: "Add a piece to your archive to unlock a styled recommendation. Your capsule starts with one great piece.",
      source: "offline",
    };
  }

  const buckets = bucketWardrobe(clothesList);
  const preferOnePiece = occasion === "FORMAL" && buckets.onepiece.length > 0;

  let top = null;
  let bottom = null;

  if (preferOnePiece || (buckets.top.length === 0 && buckets.onepiece.length > 0)) {
    top = pickRandom(buckets.onepiece);
  } else if (buckets.top.length > 0) {
    top = pickRandom(buckets.top);
    bottom = pickRandom(buckets.bottom);
  } else {
    top = pickRandom(buckets.onepiece) ?? pickRandom(clothesList);
  }

  const wantsLayer = occasion === "WORK" || occasion === "FORMAL" || Math.random() > 0.5;
  const outerwear = wantsLayer ? pickRandom(buckets.outerwear) : null;
  const footwear = pickRandom(buckets.footwear);

  const pieceNames = [top, bottom, outerwear, footwear].filter(Boolean).map((p) => p.name);

  return {
    title: top ? `The ${top.color} Edit` : "Capsule Essential",
    occasion: label,
    outfit: { top, bottom, outerwear, footwear },
    stylingTip: pieceNames.length
      ? `A considered pairing of ${pieceNames.join(", ")} — tonal, editorial, and built for ${label.toLowerCase()}. Layer with confidence and let the silhouette do the talking.`
      : "Add a piece to your archive to unlock a styled recommendation. Your capsule starts with one great piece.",
    source: "offline",
  };
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * @param {Array<{id: string, name: string, category: string, color: string, season: string, imageUri: string|null}>} clothesList
 * @param {string} occasion - one of the OCCASIONS keys (WORK/CASUAL/FORMAL/WEEKEND)
 * @returns {Promise<{title: string, occasion: string, outfit: {top: object|null, bottom: object|null, outerwear: object|null, footwear: object|null}, stylingTip: string, source?: string}>}
 */
export async function generateOutfit(clothesList, occasion) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const label = occasionLabel(occasion);

  if (!apiKey || clothesList.length === 0) {
    return localFallbackOutfit(clothesList, occasion);
  }

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

    if (!outfit.top && !outfit.bottom) {
      throw new Error("AI response referenced no valid wardrobe items");
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
