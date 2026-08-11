import { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppState } from "../src/context/AppContext";
import CupboardLogo from "../src/components/CupboardLogo";
import { colors, fonts } from "../src/theme/tokens";

const FADE_DURATION = 900;
const MIN_DISPLAY_DURATION = 2500;

export default function SplashScreen() {
  const { isReady, hasOnboarded } = useAppState();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && isReady) {
      router.replace(hasOnboarded ? "/home" : "/welcome");
    }
  }, [minTimeElapsed, isReady, hasOnboarded]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fadeGroup, { opacity }]}>
        <CupboardLogo size="lg" showWordmark={false} style={styles.mark} />
        <Animated.Text style={styles.title}>THE CUPBOARD</Animated.Text>
        <View style={styles.rule} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  fadeGroup: {
    alignItems: "center",
  },
  mark: { marginBottom: 20 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 18,
    letterSpacing: 4,
    color: colors.charcoal,
  },
  rule: {
    marginTop: 14,
    width: 28,
    height: 2,
    backgroundColor: colors.hairline,
  },
});
