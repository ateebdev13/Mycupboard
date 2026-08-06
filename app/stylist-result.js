import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import { generateOutfit } from "../src/services/geminiService";
import PrimaryButton from "../src/components/PrimaryButton";
import { colors, radius, fonts, spacing, shadow } from "../src/theme/tokens";

export default function StylistResultScreen() {
  const { clothesList, deductCredit } = useAppState();
  const [outfit, setOutfit] = useState(null);
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    deductCredit();

    generateOutfit(clothesList)
      .then(setOutfit)
      .catch((err) => setError(err.message));
  }, []);

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
          <Text style={styles.mark}>✦</Text>
          <Text style={styles.title}>{outfit.title}</Text>
          <Text style={styles.occasion}>{outfit.occasion}</Text>

          <View style={[styles.card, shadow.card]}>
            {outfit.pieces.map((piece, i) => (
              <View key={i} style={styles.pieceRow}>
                <Text style={styles.pieceIndex}>{String(i + 1).padStart(2, "0")}</Text>
                <Text style={styles.pieceText}>{piece}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.narrative}>{outfit.narrative}</Text>

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
  mark: { color: colors.gold, fontSize: 22, marginBottom: 12 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.ivory,
    textAlign: "center",
  },
  occasion: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.gold,
    marginTop: 8,
    marginBottom: spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  pieceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  pieceIndex: { fontFamily: fonts.serif, fontSize: 12, color: colors.smoke, width: 28 },
  pieceText: { fontFamily: fonts.serif, fontSize: 15, color: colors.obsidian, flex: 1 },
  narrative: {
    marginTop: spacing.xl,
    fontSize: 14,
    lineHeight: 22,
    color: colors.hairline,
    textAlign: "center",
    fontFamily: fonts.serif,
  },
});
