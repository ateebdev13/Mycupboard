import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import { generateOutfit } from "../src/services/geminiService";
import { categorizeItem } from "../src/utils/categorize";
import { takePendingOutfit } from "../src/state/outfitTransport";
import AnchorMatchCard from "../src/components/AnchorMatchCard";
import StylistLoadingGraphic from "../src/components/StylistLoadingGraphic";
import RatingModal from "../src/components/RatingModal";
import { useRotatingPhrase } from "../src/hooks/useRotatingPhrase";
import { colors, radius, fonts, spacing, shadow } from "../src/theme/tokens";

const ROLE_LABELS = {
  top: "Top",
  bottom: "Bottom",
  outerwear: "Layer",
  footwear: "Accessory",
  onepiece: "Piece",
};

function roleLabelFor(item) {
  return ROLE_LABELS[categorizeItem(item)] ?? "Piece";
}

export default function StylistResultScreen() {
  const { occasion, anchorItemId } = useLocalSearchParams();
  const { clothesList, aiCredits, deductCredit } = useAppState();
  const [outfit, setOutfit] = useState(null);
  const [ratingVisible, setRatingVisible] = useState(false);
  const ratingTimer = useRef(null);
  const phrase = useRotatingPhrase(!outfit);

  useEffect(() => {
    const pending = takePendingOutfit();
    if (pending) {
      setOutfit(pending);
      if (pending.hasMatch) {
        ratingTimer.current = setTimeout(() => setRatingVisible(true), 2000);
      }
      return;
    }

    // Defensive fallback only — the normal flow always routes through
    // /loading first, which already computes and hands off the result.
    console.warn("[stylist-result] no pending outfit found, generating inline");
    deductCredit();
    generateOutfit(clothesList, occasion, anchorItemId || null).then((result) => {
      setOutfit(result);
      if (result.hasMatch) {
        ratingTimer.current = setTimeout(() => setRatingVisible(true), 2000);
      }
    });

    return () => {
      if (ratingTimer.current) clearTimeout(ratingTimer.current);
    };
  }, []);

  function handleMatchAnother() {
    if (aiCredits <= 0) {
      router.push("/checkout");
      return;
    }
    setRatingVisible(false);
    if (ratingTimer.current) clearTimeout(ratingTimer.current);
    router.replace({ pathname: "/loading", params: { occasion, anchorItemId: anchorItemId || "" } });
  }

  function handleAddNewItem() {
    router.replace({ pathname: "/home", params: { openAdd: "1" } });
  }

  if (!outfit) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
            <Ionicons name="chevron-back" size={16} color={colors.smoke} />
            <Text style={styles.topBarLabel}>STYLIST AI</Text>
          </Pressable>
        </View>
        <View style={styles.centerWrap}>
          <StylistLoadingGraphic />
          <Text style={styles.loadingTitle}>Curating Your Style</Text>
          <Text style={styles.loadingSubtitle}>{phrase}</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!outfit.hasMatch) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
            <Ionicons name="chevron-back" size={16} color={colors.smoke} />
            <Text style={styles.topBarLabel}>STYLIST AI</Text>
          </Pressable>
        </View>
        <View style={styles.centerWrap}>
          <View style={styles.noMatchCircle}>
            <MaterialCommunityIcons name="hanger" size={34} color={colors.smoke} />
          </View>
          <Text style={styles.loadingTitle}>{outfit.title}</Text>
          <Text style={styles.noMatchBody}>{outfit.rationale}</Text>

          <Pressable onPress={handleAddNewItem} style={styles.primaryDark}>
            <Text style={styles.primaryDarkText}>+ Add New Item</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.primaryLight}>
            <Text style={styles.primaryLightText}>Try Different Occasion</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>✦ {outfit.matchScore}% Match ✦</Text>
        </View>
        <Text style={styles.occasionLine}>Curated for {outfit.occasion}</Text>

        <Text style={styles.title}>{outfit.title}</Text>

        <View style={styles.cardsWrap}>
          <AnchorMatchCard item={outfit.anchor} roleLabel={roleLabelFor(outfit.anchor)} delay={0} />
          <AnchorMatchCard item={outfit.match} roleLabel={roleLabelFor(outfit.match)} isPick delay={140} />
        </View>

        <View style={[styles.tipCard, shadow.card]}>
          <Text style={styles.tipLabel}>Styling Note</Text>
          <Text style={styles.tipText}>{outfit.rationale}</Text>
        </View>

        <Pressable onPress={handleMatchAnother} style={styles.primaryDark}>
          <Text style={styles.primaryDarkText}>Match Another Look</Text>
        </Pressable>
        <Pressable onPress={() => router.replace("/home")} style={styles.primaryLight}>
          <Text style={styles.primaryLightText}>Back to Archive</Text>
        </Pressable>
      </ScrollView>

      <RatingModal
        visible={ratingVisible}
        onSubmit={() => setRatingVisible(false)}
        onSkip={() => setRatingVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  topBar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backRow: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" },
  topBarLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.smoke,
    fontWeight: "600",
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.charcoal,
    marginTop: spacing.lg,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: colors.smoke,
    marginTop: 6,
  },
  progressTrack: {
    marginTop: spacing.xl,
    width: 120,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.hairline,
    overflow: "hidden",
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: colors.accent,
  },
  noMatchCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceTan,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  noMatchBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.smoke,
    textAlign: "center",
    marginTop: 10,
    marginBottom: spacing.xl,
  },
  body: { padding: spacing.lg, paddingBottom: 40, alignItems: "center" },
  matchBadge: {
    backgroundColor: colors.accentBg,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: spacing.sm,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
  },
  occasionLine: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.smoke,
    marginTop: 10,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.charcoal,
    textAlign: "center",
    marginTop: 8,
    marginBottom: spacing.lg,
  },
  cardsWrap: { width: "100%" },
  tipCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
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
    color: colors.charcoal,
  },
  primaryDark: {
    width: "100%",
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryDarkText: { color: colors.ivory, fontSize: 14, fontWeight: "600" },
  primaryLight: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryLightText: { color: colors.charcoal, fontSize: 14, fontWeight: "600" },
});
