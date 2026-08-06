import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, radius, fonts } from "../theme/tokens";

export default function PrimaryButton({ label, onPress, disabled, loading, variant = "dark", style }) {
  const isLight = variant === "light";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isLight ? styles.light : styles.dark,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isLight ? colors.obsidian : colors.ivory} />
      ) : (
        <Text style={[styles.label, isLight ? styles.labelDark : styles.labelLight]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  dark: { backgroundColor: colors.obsidian },
  light: { backgroundColor: colors.ivory, borderWidth: 1, borderColor: colors.obsidian },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
  label: {
    fontFamily: fonts.system,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  labelLight: { color: colors.ivory },
  labelDark: { color: colors.obsidian },
});
