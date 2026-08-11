# The Cupboard

A luxury-positioned AI wardrobe management prototype for the Pakistani market, built with Expo (React Native) and expo-router. All state is persisted locally via AsyncStorage — no backend required.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android) to run it on a device, or press `i` / `a` for a simulator/emulator.

## AI Stylist (optional)

The AI Stylist calls Gemini Flash when an API key is present, and otherwise falls back to a local editorial outfit generator so the whole flow works offline in Expo Go. Every result pairs one Top with one Bottom — an **Anchor** (chosen freely, or fixed when styling around a specific archive item) and its best-matching **Match** for the selected occasion.

To enable live Gemini calls, create a `.env` file:

```
EXPO_PUBLIC_GEMINI_API_KEY=your-key-here
```

## Mock payments (sandbox)

`src/services/mockPaymentService.js` simulates JazzCash / EasyPaisa / Card checkouts — no real payment provider is involved.

- Any account/card number **not** ending in `0000` → succeeds instantly and unlocks the selected plan.
- Any account/card number ending in `0000` → fails after a ~2s delay with "Insufficient funds in wallet".
- The "Cancel" button on the checkout sheet aborts the transaction locally.

## Project structure

```
app/                     expo-router screens (file-based routing)
  splash.js                /splash — logo fade-in, routes to /welcome or /home
  welcome.js                /welcome — hero + mock Google sign-in
  home.js                     /home — archive grid, credit pill (opens Paywall), add drawer
  item/[id].js                 /item/:id — full-bleed item detail, "Style Around This Item"
  stylist-result.js         /stylist-result — loading, Anchor+Match result, rating, no-match
  checkout.js                /checkout — plan + payment sheet (Paywall, modal)
src/
  context/AppContext.js      persisted app state (tier, credits, wardrobe, onboarding)
  services/mockPaymentService.js
  services/geminiService.js   Anchor+Match outfit generation
  constants/occasions.js       categorized occasion taxonomy
  utils/categorize.js           shared top/bottom/outerwear/footwear classifier
  components/                    shared UI (CupboardLogo, OccasionModal, AddItemDrawer, ...)
  theme/tokens.js                 editorial styling tokens (warm off-white + charcoal)
```

## Plans

| Parameter | Free | Micro Top-Up (Rs. 50) | Infinite Style (Rs. 500/mo) |
| --- | --- | --- | --- |
| `userTier` | `FREE` | `FREE` | `INFINITE` |
| `maxStorage` | 10 | 10 | 20 |
| `aiCredits` | 1 | +5 | 15 |
