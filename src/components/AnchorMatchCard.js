import { useEffect, useRef } from "react";
import { Animated, View, Text, Image, StyleSheet } from "react-native";
import { colors, radius, fonts, shadow } from "../theme/tokens";

export default function AnchorMatchCard({ item, roleLabel, isPick = false, delay = 0 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 450,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  };

  return (
    <Animated.View style={[styles.card, shadow.card, animatedStyle]}>
      <View style={styles.imageWrap}>
        {item?.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderInitial}>{item?.category?.[0]?.toUpperCase() ?? "C"}</Text>
          </View>
        )}
        {isPick && (
          <View style={styles.pickTag}>
            <Text style={styles.pickTagText}>✦ Stylist Pick</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item?.name}
      </Text>
      <Text style={styles.caption}>{roleLabel} · From Your Archive</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 14,
  },
  imageWrap: {
    width: "100%",
    height: 180,
    maxHeight: 200,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceTan,
    marginBottom: 10,
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderInitial: { fontFamily: fonts.serif, fontSize: 44, color: colors.smoke },
  pickTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  pickTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accent,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 17,
    color: colors.charcoal,
  },
  caption: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.smoke,
    marginTop: 2,
    fontWeight: "600",
  },
});
