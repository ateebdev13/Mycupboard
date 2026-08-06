// AI Stylist integration. Uses Gemini Flash via plain fetch when an API key is
// configured (EXPO_PUBLIC_GEMINI_API_KEY), otherwise falls back to a local
// editorial-style generator so the flow stays fully testable in Expo Go offline.

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildPrompt(clothesList) {
  const wardrobeText = clothesList
    .map((item, i) => `${i + 1}. ${item.name} — ${item.category}, ${item.color}, season: ${item.season}`)
    .join("\n");

  return `You are a luxury fashion stylist for MeraWardrobe, a Pakistani wardrobe app.
Given this wardrobe, recommend ONE complete outfit using only pieces listed below.
Wardrobe:
${wardrobeText}

Respond in strict JSON, no markdown fences, with this shape:
{
  "title": "short editorial outfit name",
  "pieces": ["piece 1", "piece 2", "..."],
  "narrative": "2-3 sentence editorial styling note explaining why this works",
  "occasion": "suggested occasion"
}`;
}

function localFallbackOutfit(clothesList) {
  const shuffled = [...clothesList].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, Math.min(3, shuffled.length));
  const pieceNames = picks.map((p) => p.name);

  return {
    title: picks.length ? `The ${picks[0].color} Edit` : "Capsule Essential",
    pieces: pieceNames.length ? pieceNames : ["Your archive is ready for its first piece"],
    narrative: picks.length
      ? `A considered pairing of ${pieceNames.join(", ")} — tonal, editorial, and built for effortless movement through the day.`
      : "Add a piece to your archive to unlock a styled recommendation.",
    occasion: "Everyday Editorial",
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
 * @param {Array<{name: string, category: string, color: string, season: string}>} clothesList
 * @returns {Promise<{title: string, pieces: string[], narrative: string, occasion: string, source?: string}>}
 */
export async function generateOutfit(clothesList) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || clothesList.length === 0) {
    return localFallbackOutfit(clothesList);
  }

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(clothesList) }] }],
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty Gemini response");

    const parsed = extractJson(text);
    return { ...parsed, source: "gemini" };
  } catch (err) {
    console.warn("[geminiService] falling back to offline stylist:", err.message);
    return localFallbackOutfit(clothesList);
  }
}
