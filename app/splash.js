import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppState } from "../src/context/AppContext";
import CupboardLogo from "../src/components/CupboardLogo";
import { colors, fonts } from "../src/theme/tokens";

const SPLASH_DURATION = 2500;

export default function SplashScreen() {
  const { isReady, hasOnboarded } = useAppState();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isReady) {
        router.replace(hasOnboarded ? "/home" : "/welcome");
      }
    }, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [isReady, hasOnboarded]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <CupboardLogo size="lg" showWordmark={false} style={styles.mark} />
      <Animated.Text style={styles.title}>THE CUPBOARD</Animated.Text>
      <Animated.View style={styles.rule} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
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
