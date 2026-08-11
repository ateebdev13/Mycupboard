import { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/tokens";

export default function StylistLoadingGraphic() {
  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true })
    );
    pulseLoop.start();
    spinLoop.start();
    return () => {
      pulseLoop.stop();
      spinLoop.stop();
    };
  }, []);

  const outerScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const outerOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.outer, { transform: [{ scale: outerScale }], opacity: outerOpacity }]} />
      <View style={styles.inner}>
        <MaterialCommunityIcons name="wardrobe-outline" size={30} color={colors.charcoal} />
      </View>
      <Text style={styles.sparkle}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 2,
    borderColor: colors.accentBg,
    borderTopColor: colors.accent,
  },
  outer: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accentBg,
  },
  inner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceTan,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    top: 6,
    right: 6,
    fontSize: 16,
    color: colors.accent,
  },
});
