export const STYLE_PROFILES = [
  { key: "UNISEX", label: "Unisex" },
  { key: "MENSWEAR", label: "Menswear" },
  { key: "WOMENSWEAR", label: "Womenswear" },
];

export const DEFAULT_STYLE_PROFILE = "UNISEX";

/** Two items are style-compatible if either is Unisex, or both share the same explicit profile. */
export function isStyleCompatible(a, b) {
  const aProfile = a?.styleProfile ?? DEFAULT_STYLE_PROFILE;
  const bProfile = b?.styleProfile ?? DEFAULT_STYLE_PROFILE;
  if (aProfile === DEFAULT_STYLE_PROFILE || bProfile === DEFAULT_STYLE_PROFILE) return true;
  return aProfile === bProfile;
}
