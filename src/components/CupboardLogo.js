import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius, fonts } from "../theme/tokens";

const SIZES = {
  sm: { mark: 30, icon: 16, sparkle: 9, wordmark: 13, gap: 8 },
  md: { mark: 48, icon: 26, sparkle: 12, wordmark: 16, gap: 12 },
  lg: { mark: 96, icon: 48, sparkle: 20, wordmark: 22, gap: 18 },
};

export default function CupboardLogo({ size = "md", showWordmark = true, style }) {
  const s = SIZES[size] ?? SIZES.md;

  return (
    <View style={[styles.row, { gap: s.gap }, style]}>
      <View style={[styles.mark, { width: s.mark, height: s.mark, borderRadius: s.mark * 0.28 }]}>
        <MaterialCommunityIcons name="wardrobe-outline" size={s.icon} color={colors.charcoal} />
        <Text style={[styles.sparkle, { fontSize: s.sparkle, top: -s.sparkle * 0.4, right: -s.sparkle * 0.4 }]}>
          ✦
        </Text>
      </View>
      {showWordmark && (
        <Text style={[styles.wordmark, { fontSize: s.wordmark }]}>THE CUPBOARD</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mark: {
    backgroundColor: colors.surfaceTan,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    color: colors.accent,
  },
  wordmark: {
    fontFamily: fonts.serif,
    letterSpacing: 2,
    color: colors.charcoal,
  },
});
