import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";
import { colors } from "../theme/tokens";

const SPARKLES = [
  { glyph: "✦", top: 6, left: "14%", size: 16, delay: 0 },
  { glyph: "✧", top: 28, left: "82%", size: 20, delay: 180 },
  { glyph: "✦", top: 60, left: "6%", size: 12, delay: 360 },
  { glyph: "✧", top: 4, left: "68%", size: 12, delay: 260 },
  { glyph: "✦", top: 46, left: "92%", size: 14, delay: 90 },
];

function Sparkle({ glyph, top, left, size, delay }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(600),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.glyph,
        {
          top,
          left,
          fontSize: size,
          opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 1] }),
          transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.15] }) }],
        },
      ]}
    >
      {glyph}
    </Animated.Text>
  );
}

export default function SparkleBurst() {
  return (
    <Animated.View style={styles.wrap} pointerEvents="none">
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    width: "100%",
    height: 90,
    top: 0,
  },
  glyph: {
    position: "absolute",
    color: colors.gold,
  },
});
