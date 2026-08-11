// In-memory hand-off for a freshly generated outfit between /loading and
// /stylist-result. Outfit results contain nested wardrobe item objects that
// don't survive round-tripping through string-only router params, so they're
// passed via this module-level singleton instead — valid for the lifetime of
// the JS runtime, which is exactly the scope of a single navigation hop.

let pendingOutfit = null;

export function setPendingOutfit(outfit) {
  pendingOutfit = outfit;
}

export function takePendingOutfit() {
  const outfit = pendingOutfit;
  pendingOutfit = null;
  return outfit;
}
