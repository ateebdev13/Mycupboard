import { Platform } from "react-native";

export const colors = {
  obsidian: "#0A0A0A",
  ink: "#141414",
  charcoal: "#2A2A2A",
  smoke: "#6B6B6B",
  hairline: "#E4E1DB",
  bone: "#F6F4EF",
  ivory: "#FFFFFF",
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
    fontSize: 34,
    letterSpacing: 1,
    color: colors.obsidian,
  },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 20,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.obsidian,
  },
  label: {
    fontFamily: fonts.system,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.smoke,
    fontWeight: "600",
  },
  body: {
    fontFamily: fonts.system,
    fontSize: 14,
    color: colors.charcoal,
  },
};

export const shadow = {
  card: {
    shadowColor: colors.obsidian,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  float: {
    shadowColor: colors.obsidian,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
};
