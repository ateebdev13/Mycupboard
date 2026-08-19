// AI Stylist integration. Uses Gemini Flash via plain fetch when an API key is
// configured (EXPO_PUBLIC_GEMINI_API_KEY), otherwise falls back to a local
// editorial-style generator so the flow stays fully testable in Expo Go offline.
//
// Pipeline for every call:
//   1. Resolve the anchor item (fixed, from the item-detail flow, or chosen
//      locally when none is given).
//   2. Build a candidate pool LOCALLY, before any AI call: only items from
//      the anchor's complementary category (Top<->Bottom) that are also
//      style/gender-compatible (Menswear/Womenswear never cross-paired
//      unless one side is Unisex). Gemini only ever sees this pool — it
//      cannot select outside it.
//   3. If the pool is empty, or the best available match — from Gemini or
//      the local scorer — doesn't clear a 70% confidence threshold, the
//      call resolves to hasMatch: false instead of ever rendering a weak
//      or same-category pairing.

import { occasionLabel, formalityWeight } from "../constants/occasions";
import { categorizeItem } from "../utils/categorize";
import { isStyleCompatible } from "../constants/styleProfiles";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MATCH_SCORE_THRESHOLD = 70;

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

/** A "bottom" pairs with a top match, everything else (top/onepiece/outerwear/footwear) pairs with a bottom match. */
function complementBucketFor(anchorItem) {
  return categorizeItem(anchorItem) === "bottom" ? "top" : "bottom";
}

/**
 * Local candidate pool, computed BEFORE any AI call: only items from the
 * anchor's complementary category, style/gender-compatible with the anchor,
 * excluding the anchor itself.
 */
function buildCandidatePool(anchor, clothesList) {
  const requiredBucket = complementBucketFor(anchor);
  return clothesList.filter(
    (item) => item.id !== anchor.id && categorizeItem(item) === requiredBucket && isStyleCompatible(anchor, item)
  );
}

/** Picks a free-choice anchor when none was supplied: prefer a top, else a bottom. */
function resolveWorkingAnchor(clothesList, fixedAnchor) {
  if (fixedAnchor) return fixedAnchor;
  const buckets = bucketWardrobe(clothesList);
  if (buckets.top.length > 0) return pickRandom(buckets.top);
  if (buckets.bottom.length > 0) return pickRandom(buckets.bottom);
  return null;
}

/** Raw compatibility signal between anchor and candidate — color, season, formality. */
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

/** Normalizes the raw compatibility signal to a 0-100 confidence score for the >70% threshold. */
function computeMatchScore(anchor, candidate, occasion) {
  return Math.min(100, Math.round(55 + compatibilityScore(anchor, candidate, occasion) * 9));
}

function buildNoMatch(occasion, anchor) {
  const label = occasionLabel(occasion);
  const itemName = anchor?.name ?? "this item";
  return {
    hasMatch: false,
    title: "No Suitable Match Found",
    occasion: label,
    anchor: anchor ?? null,
    match: null,
    matchScore: 0,
    rationale: `You don't have a complementary item in your Cupboard that matches this ${itemName} for ${label}.`,
    source: "offline",
  };
}

/** Best candidate from the pool by local scoring, with light randomness among close ties. */
function localBestMatch(anchor, candidatePool, occasion) {
  const ranked = [...candidatePool].sort(
    (a, b) => compatibilityScore(anchor, b, occasion) - compatibilityScore(anchor, a, occasion)
  );
  const topScore = compatibilityScore(anchor, ranked[0], occasion);
  const contenders = ranked.filter((c) => compatibilityScore(anchor, c, occasion) === topScore);
  const match = pickRandom(contenders);
  const matchScore = computeMatchScore(anchor, match, occasion);

  if (matchScore <= MATCH_SCORE_THRESHOLD) {
    return buildNoMatch(occasion, anchor);
  }

  const label = occasionLabel(occasion);
  return {
    hasMatch: true,
    title: `The ${anchor.color} Edit`,
    occasion: label,
    anchor,
    match,
    matchScore,
    rationale: `${anchor.name} and ${match.name} share a tonal, editorial balance built for ${label.toLowerCase()}. Let the pairing anchor the rest of your look with quiet confidence.`,
    source: "offline",
  };
}

function buildPrompt(anchor, candidatePool, occasion) {
  const anchorBucket = categorizeItem(anchor);
  const requiredBucket = complementBucketFor(anchor);
  const label = occasionLabel(occasion);
  const candidateText = candidatePool
    .map(
      (item) =>
        `- id: ${item.id} | ${item.name} | category: ${item.category} | color: ${item.color} | season: ${item.season} | style: ${item.styleProfile ?? "UNISEX"}`
    )
    .join("\n");

  return `You are a luxury fashion stylist for The Cupboard, a Pakistani wardrobe app.
The user is dressing for: "${label}" and has already chosen this anchor piece: id ${anchor.id} (${anchor.name}, category: ${anchor.category} — a "${anchorBucket}", color: ${anchor.color}, style: ${anchor.styleProfile ?? "UNISEX"}).

This candidate list has ALREADY been filtered to only "${requiredBucket}" items that are style/gender-compatible with the anchor — every item below is a valid category and style match. Choose the SINGLE best pairing from this list for the occasion, weighing color harmony, season, and formality:
${candidateText}

Respond in strict JSON, no markdown fences, with this exact shape:
{
  "title": "short editorial outfit name",
  "matchedItemId": "id from the candidate list above (required)",
  "matchScore": 0-100 confidence score for how well this specific pairing suits the occasion,
  "rationale": "exactly 2 sentences of editorial styling advice explaining why this pairing works for the anchor, the match, and the occasion"
}`;
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

/** Calls Gemini scoped to the pre-filtered candidate pool. Returns null (never throws for bad content) to signal the caller should fall back to local scoring. */
async function requestGeminiMatch(anchor, candidatePool, occasion) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(anchor, candidatePool, occasion) }] }],
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty Gemini response");

  const parsed = extractJson(text);
  const byId = new Map(candidatePool.map((item) => [item.id, item]));
  const match = parsed.matchedItemId ? byId.get(parsed.matchedItemId) : null;
  const matchScore = Number(parsed.matchScore);

  // Gemini can only legally choose from the candidate pool we sent it, but
  // it's an LLM, not a database — hallucinated/missing ids or a non-numeric
  // score are not trustworthy. Signal the caller to fall back locally.
  if (!match || !Number.isFinite(matchScore)) return null;

  if (matchScore <= MATCH_SCORE_THRESHOLD) {
    return buildNoMatch(occasion, anchor);
  }

  return {
    hasMatch: true,
    title: parsed.title || "Curated Look",
    occasion: occasionLabel(occasion),
    anchor,
    match,
    matchScore,
    rationale: parsed.rationale || "A cohesive, editorial pairing curated for your day.",
    source: "gemini",
  };
}

/**
 * @param {Array<{id: string, name: string, category: string, color: string, season: string, styleProfile?: string, imageUri: string|null}>} clothesList
 * @param {string} occasion - one of the OCCASIONS keys from src/constants/occasions.js
 * @param {string|null} [anchorItemId] - when set, this item is always the anchor and only its match is generated
 * @returns {Promise<{hasMatch: boolean, title: string, occasion: string, anchor: object|null, match: object|null, matchScore: number, rationale: string, source?: string}>}
 */
export async function generateOutfit(clothesList, occasion, anchorItemId = null) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const fixedAnchor = anchorItemId ? clothesList.find((i) => i.id === anchorItemId) ?? null : null;
  const anchor = resolveWorkingAnchor(clothesList, fixedAnchor);

  if (!anchor) {
    return buildNoMatch(occasion, null);
  }

  const candidatePool = buildCandidatePool(anchor, clothesList);
  if (candidatePool.length === 0) {
    return buildNoMatch(occasion, anchor);
  }

  if (apiKey) {
    try {
      const geminiResult = await requestGeminiMatch(anchor, candidatePool, occasion);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn("[geminiService] Gemini call failed, falling back to local scoring:", err.message);
    }
  }

  return localBestMatch(anchor, candidatePool, occasion);
}
