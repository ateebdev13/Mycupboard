import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import { generateOutfit } from "../src/services/geminiService";
import PrimaryButton from "../src/components/PrimaryButton";
import PolaroidCard from "../src/components/PolaroidCard";
import SparkleBurst from "../src/components/SparkleBurst";
import { colors, radius, fonts, spacing, shadow } from "../src/theme/tokens";

const SLOT_META = [
  { key: "top", label: "Top", rotation: -4 },
  { key: "bottom", label: "Bottom", rotation: 3 },
  { key: "outerwear", label: "Layer", rotation: -3 },
  { key: "footwear", label: "Finish", rotation: 4 },
];

export default function StylistResultScreen() {
  const { occasion } = useLocalSearchParams();
  const { clothesList, deductCredit } = useAppState();
  const [outfit, setOutfit] = useState(null);
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    deductCredit();

    generateOutfit(clothesList, occasion)
      .then(setOutfit)
      .catch((err) => setError(err.message));
  }, []);

  const filledSlots = outfit ? SLOT_META.filter((slot) => outfit.outfit[slot.key]) : [];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>AI Stylist</Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.ivory} />
        </Pressable>
      </View>

      {!outfit && !error && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.gold} size="large" />
          <Text style={styles.loadingText}>Curating your outfit…</Text>
        </View>
      )}

      {error && (
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>{error}</Text>
        </View>
      )}

      {outfit && (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.celebrationWrap}>
            <SparkleBurst />
            <Text style={styles.celebrationTitle}>✦ OUTFIT CURATED ✦</Text>
          </View>

          <Text style={styles.title}>{outfit.title}</Text>

          <View style={styles.occasionBadge}>
            <Text style={styles.occasionBadgeText}>{outfit.occasion}</Text>
          </View>

          {filledSlots.length > 0 ? (
            <View style={styles.polaroidRow}>
              {filledSlots.map((slot, i) => (
                <PolaroidCard
                  key={slot.key}
                  item={outfit.outfit[slot.key]}
                  slotLabel={slot.label}
                  rotation={slot.rotation}
                  delay={i * 140}
                />
              ))}
            </View>
          ) : null}

          <View style={[styles.tipCard, shadow.card]}>
            <Text style={styles.tipLabel}>Styling Note</Text>
            <Text style={styles.tipText}>{outfit.stylingTip}</Text>
          </View>

          <PrimaryButton
            label="Back To Archive"
            variant="light"
            onPress={() => router.replace("/home")}
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.obsidian },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.smoke,
  },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.ivory, marginTop: spacing.md, fontFamily: fonts.serif },
  body: { padding: spacing.lg, alignItems: "center" },
  celebrationWrap: {
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  celebrationTitle: {
    fontFamily: fonts.serif,
    fontSize: 15,
    letterSpacing: 3,
    color: colors.gold,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.ivory,
    textAlign: "center",
    marginTop: 4,
  },
  occasionBadge: {
    marginTop: 12,
    marginBottom: spacing.xl,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  occasionBadgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.gold,
    fontWeight: "600",
  },
  polaroidRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: spacing.xl,
  },
  tipCard: {
    width: "100%",
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  tipLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.smoke,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipText: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 22,
    color: colors.obsidian,
  },
});
