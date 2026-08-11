import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useAppState } from "../src/context/AppContext";
import { generateOutfit } from "../src/services/geminiService";
import { setPendingOutfit } from "../src/state/outfitTransport";
import StylistLoadingGraphic from "../src/components/StylistLoadingGraphic";
import { useRotatingPhrase } from "../src/hooks/useRotatingPhrase";
import { colors, radius, fonts, spacing } from "../src/theme/tokens";

const MIN_LOADING_DURATION = 2500;

export default function LoadingScreen() {
  const { occasion, anchorItemId } = useLocalSearchParams();
  const { clothesList, deductCredit } = useAppState();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [result, setResult] = useState(null);
  const hasRun = useRef(false);
  const phrase = useRotatingPhrase(true);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_DURATION);
    deductCredit();
    generateOutfit(clothesList, occasion, anchorItemId || null).then(setResult);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && result) {
      setPendingOutfit(result);
      router.replace({ pathname: "/stylist-result", params: { occasion, anchorItemId: anchorItemId || "" } });
    }
  }, [minTimeElapsed, result]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.centerWrap}>
        <StylistLoadingGraphic />
        <Text style={styles.title}>Curating Your Style</Text>
        <Text style={styles.subtitle}>{phrase}</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.charcoal,
    marginTop: spacing.lg,
  },
  subtitle: {
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
});
