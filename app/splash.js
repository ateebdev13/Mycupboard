import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppState } from "../src/context/AppContext";
import { colors, fonts } from "../src/theme/tokens";

export default function SplashScreen() {
  const { isReady } = useAppState();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isReady) {
        router.replace("/home");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isReady]);

  return (
    <View style={styles.container}>
      <Text style={styles.mark}>✦</Text>
      <Text style={styles.title}>MERAWARDROBE</Text>
      <Text style={styles.subtitle}>THE DIGITAL ARCHIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: "center",
    justifyContent: "center",
  },
  mark: {
    color: colors.gold,
    fontSize: 22,
    marginBottom: 18,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    letterSpacing: 6,
    color: colors.ivory,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 11,
    letterSpacing: 4,
    color: colors.smoke,
  },
});
