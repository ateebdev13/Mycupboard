// AI Stylist integration. Uses Gemini Flash via plain fetch when an API key is
// configured (EXPO_PUBLIC_GEMINI_API_KEY), otherwise falls back to a local
// editorial-style generator so the flow stays fully testable in Expo Go offline.
//
// Every result is an Anchor + Match pairing: one top and one bottom, resolved
// back to the caller's own wardrobe items (with imageUri) by ID, never
// invented. When an anchorItemId is supplied (styling around a specific
// piece from its detail view), that item is always the anchor and only its
// complementary piece is chosen. Without one, the anchor is chosen freely.
// If the wardrobe can't supply a valid pairing, the service reports
// noMatch: true instead of ever rendering half an outfit.

import { occasionLabel, formalityWeight } from "../constants/occasions";
import { categorizeItem } from "../utils/categorize";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const NEUTRAL_COLORS = ["black", "white", "ivory", "beige", "tan", "grey", "gray", "navy", "brown", "charcoal", "cream", "stone", "khaki"];

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

/** Scores how well `candidate` pairs with `anchor` for the occasion — color, season, formality. */
function compatibilityScore(anchor, candidate, occasion) {
  const anchorColor = (anchor.color ?? "").trim().toLowerCase();
  const candidateColor = (candidate.color ?? "").trim().toLowerCase();
  let score = 0;

  if (NEUTRAL_COLORS.includes(anchorColor) || NEUTRAL_COLORS.includes(candidateColor)) score += 2;
  if (anchorColor && anchorColor === candidateColor) score += 1;
  if (anchor.season === candidate.season || anchor.season === "All Season" || candidate.season === "All Season") score += 1;

  const formality = formalityWeight(occasion);
  if (formality >= 2 && NEUTRAL_COLORS.includes(anchorColor) && NEUTRAL_COLORS.includes(candidateColor)) score += 1;
  if (formality === 0) score += 0.5; // casual pairings are more forgiving

  return score;
}

/** Picks the candidate that best pairs with `anchor` for the occasion, with light randomness among close ties. */
function pickBestMatch(anchor, candidates, occasion) {
  if (!candidates || candidates.length === 0) return null;
  if (!anchor) return pickRandom(candidates);

  const ranked = [...candidates].sort(
    (a, b) => compatibilityScore(anchor, b, occasion) - compatibilityScore(anchor, a, occasion)
  );
  const topScore = compatibilityScore(anchor, ranked[0], occasion);
  const contenders = ranked.filter((c) => compatibilityScore(anchor, c, occasion) === topScore);
  return pickRandom(contenders);
}

/** A "bottom" anchors to a top match, everything else (top/onepiece/outerwear/footwear) anchors to a bottom match. */
function complementBucketFor(anchorItem) {
  return categorizeItem(anchorItem) === "bottom" ? "top" : "bottom";
}

/**
 * Builds a mandatory anchor+match pairing from the wardrobe buckets.
 * If `fixedAnchor` is given, it is always the anchor. Otherwise a top is
 * preferred as the anchor, falling back to a bottom if no tops exist.
 * Either side of the returned pair may be null if the wardrobe can't supply it.
 */
function pairAnchorAndMatch(buckets, occasion, fixedAnchor) {
  if (fixedAnchor) {
    const matchBucket = complementBucketFor(fixedAnchor);
    return { anchor: fixedAnchor, match: pickBestMatch(fixedAnchor, buckets[matchBucket], occasion) };
  }
  if (buckets.top.length > 0) {
    const anchor = pickRandom(buckets.top);
    return { anchor, match: pickBestMatch(anchor, buckets.bottom, occasion) };
  }
  if (buckets.bottom.length > 0) {
    const anchor = pickRandom(buckets.bottom);
    return { anchor, match: pickBestMatch(anchor, buckets.top, occasion) };
  }
  return { anchor: null, match: null };
}

function buildNoMatch(occasion) {
  return {
    title: "No Match Found",
    occasion: occasionLabel(occasion),
    anchor: null,
    match: null,
    stylingTip:
      "None of the items you have will match with your selected occasion. Let's expand your wardrobe or try a different approach.",
    noMatch: true,
    source: "offline",
  };
}

function buildPrompt(clothesList, occasion, anchorItem) {
  const wardrobeText = clothesList
    .map((item) => `- id: ${item.id} | ${item.name} | category: ${item.category} | color: ${item.color} | season: ${item.season}`)
    .join("\n");
  const label = occasionLabel(occasion);

  if (anchorItem) {
    return `You are a luxury fashion stylist for The Cupboard, a Pakistani wardrobe app.
The user is dressing for: "${label}" and has already chosen this anchor piece: id ${anchorItem.id} (${anchorItem.name}, ${anchorItem.category}, ${anchorItem.color}).

From the wardrobe below, choose EXACTLY ONE complementary piece that pairs with the anchor for this occasion (a bottom if the anchor is a top, or a top if the anchor is a bottom). The pairing MUST match in style, color, and formality for the occasion. Do not select the anchor itself.

Only choose from this exact wardrobe, referencing items by their id field:
${wardrobeText}

Respond in strict JSON, no markdown fences, with this exact shape:
{
  "title": "short editorial outfit name",
  "matchId": "id (required)",
  "stylingTip": "exactly 2 sentences of editorial styling advice explaining why the pairing works for the occasion"
}`;
  }

  return `You are a luxury fashion stylist for The Cupboard, a Pakistani wardrobe app.
The user is dressing for: "${label}".

From the wardrobe below, choose EXACTLY ONE cohesive outfit: 1 Top AND 1 Bottom that match each other in style, color, and formality for the occasion. A complete pairing is MANDATORY — never respond with only one item, and never substitute a one-piece dress/jumpsuit for a top+bottom pair.

Only choose from this exact wardrobe, referencing items by their id field:
${wardrobeText}

Respond in strict JSON, no markdown fences, with this exact shape:
{
  "title": "short editorial outfit name",
  "anchorId": "id (required, the top)",
  "matchId": "id (required, the bottom)",
  "stylingTip": "exactly 2 sentences of editorial styling advice explaining why the top and bottom work together for the occasion"
}`;
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function localFallbackOutfit(clothesList, occasion, fixedAnchor) {
  const label = occasionLabel(occasion);
  const buckets = bucketWardrobe(clothesList);
  const { anchor, match } = pairAnchorAndMatch(buckets, occasion, fixedAnchor);

  if (!anchor || !match) {
    return buildNoMatch(occasion);
  }

  return {
    title: `The ${anchor.color} Edit`,
    occasion: label,
    anchor,
    match,
    stylingTip: `${anchor.name} and ${match.name} share a tonal, editorial balance built for ${label.toLowerCase()}. Let the pairing anchor the rest of your look with quiet confidence.`,
    source: "offline",
  };
}

/**
 * @param {Array<{id: string, name: string, category: string, color: string, season: string, imageUri: string|null}>} clothesList
 * @param {string} occasion - one of the OCCASIONS keys from src/constants/occasions.js
 * @param {string|null} [anchorItemId] - when set, this item is always the anchor and only its match is generated
 * @returns {Promise<{title: string, occasion: string, anchor: object|null, match: object|null, stylingTip: string, noMatch?: boolean, source?: string}>}
 */
export async function generateOutfit(clothesList, occasion, anchorItemId = null) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const fixedAnchor = anchorItemId ? clothesList.find((i) => i.id === anchorItemId) ?? null : null;

  if (!apiKey || clothesList.length === 0) {
    return localFallbackOutfit(clothesList, occasion, fixedAnchor);
  }

  const buckets = bucketWardrobe(clothesList);
  const label = occasionLabel(occasion);
  const byId = new Map(clothesList.map((item) => [item.id, item]));

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(clothesList, occasion, fixedAnchor) }] }],
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty Gemini response");

    const parsed = extractJson(text);
    let anchor = fixedAnchor ?? (parsed.anchorId ? byId.get(parsed.anchorId) ?? null : null);
    let match = parsed.matchId ? byId.get(parsed.matchId) ?? null : null;

    // The AI must return a full pairing. If it left either side null or
    // hallucinated an id, repair the pairing locally rather than discarding
    // a perfectly good styling tip and title.
    if (!anchor || !match) {
      const repaired = pairAnchorAndMatch(buckets, occasion, fixedAnchor ?? anchor);
      anchor = anchor ?? repaired.anchor;
      match = match ?? repaired.match;
    }

    if (!anchor || !match) {
      return buildNoMatch(occasion);
    }

    return {
      title: parsed.title || "Curated Look",
      occasion: label,
      anchor,
      match,
      stylingTip: parsed.stylingTip || "A cohesive, editorial pairing curated for your day.",
      source: "gemini",
    };
  } catch (err) {
    console.warn("[geminiService] falling back to offline stylist:", err.message);
    return localFallbackOutfit(clothesList, occasion, fixedAnchor);
  }
}
