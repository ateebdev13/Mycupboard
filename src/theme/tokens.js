import { Platform } from "react-native";

export const colors = {
  canvas: "#F7F2E7",
  surface: "#FFFFFF",
  surfaceTan: "#EFE7D3",
  charcoal: "#1E1B17",
  charcoalSoft: "#3D372E",
  smoke: "#8C8577",
  hairline: "#E6DECC",
  ivory: "#FFFFFF",
  accent: "#6E5FA6",
  accentBg: "#EEE9F7",
  gold: "#B8985A",
  error: "#B3261E",
  success: "#1E6B4C",
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fonts = {
  serif: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }),
  serifBold: Platform.select({ ios: "Georgia-Bold", android: "serif", default: "Georgia" }),
  system: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
};

export const type = {
  display: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.charcoal,
  },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.charcoal,
  },
  label: {
    fontFamily: fonts.system,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.smoke,
    fontWeight: "600",
  },
  body: {
    fontFamily: fonts.system,
    fontSize: 14,
    color: colors.charcoalSoft,
  },
};

export const shadow = {
  card: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  float: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },
};
