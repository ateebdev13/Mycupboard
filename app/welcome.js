import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import { colors, radius, fonts, spacing } from "../src/theme/tokens";

export default function WelcomeScreen() {
  const { completeOnboarding } = useAppState();

  function handleContinue() {
    completeOnboarding();
    router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.hero} />

      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>‹ AI STYLIST ENABLED ›</Text>
        </View>

        <Text style={styles.headline}>Your digital closet, curated by AI.</Text>
        <Text style={styles.subtext}>
          Organize your archive and discover your next look with our AI stylist.
        </Text>

        <Pressable onPress={handleContinue} style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
          <Ionicons name="logo-google" size={18} color={colors.ivory} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <Text style={styles.terms}>BY CONTINUING, YOU AGREE TO OUR TERMS</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  hero: { flex: 1 },
  body: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.smoke,
    fontWeight: "600",
  },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.charcoal,
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.smoke,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 16,
    width: "100%",
  },
  pressed: { opacity: 0.85 },
  googleButtonText: {
    color: colors.ivory,
    fontSize: 15,
    fontWeight: "600",
  },
  terms: {
    marginTop: spacing.lg,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.smoke,
  },
});
