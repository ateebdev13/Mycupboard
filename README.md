# MeraWardrobe

A luxury-positioned AI wardrobe management prototype for the Pakistani market, built with Expo (React Native) and expo-router. All state is persisted locally via AsyncStorage — no backend required.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android) to run it on a device, or press `i` / `a` for a simulator/emulator.

## AI Stylist (optional)

The AI Stylist calls Gemini Flash when an API key is present, and otherwise falls back to a local editorial outfit generator so the whole flow works offline in Expo Go.

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
app/                  expo-router screens (file-based routing)
  splash.js            /splash — brand splash, hydrates state
  home.js               /home — wardrobe grid + credit badge
  add-item.js           /add-item — add a garment (modal)
  detail.js              /detail — garment detail (modal)
  stylist-result.js     /stylist-result — AI outfit recommendation
  checkout.js            /checkout — plan + payment sheet (modal)
src/
  context/AppContext.js   persisted app state (tier, credits, wardrobe)
  services/mockPaymentService.js
  services/geminiService.js
  components/              shared UI (ClothesCard, PrimaryButton)
  theme/tokens.js           editorial styling tokens
```

## Plans

| Parameter | Free | Micro Top-Up (Rs. 50) | Infinite Style (Rs. 500/mo) |
| --- | --- | --- | --- |
| `userTier` | `FREE` | `FREE` | `INFINITE` |
| `maxStorage` | 10 | 10 | 20 |
| `aiCredits` | 1 | +5 | 15 |
