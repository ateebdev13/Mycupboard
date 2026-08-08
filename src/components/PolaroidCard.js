import { useEffect, useRef } from "react";
import { Animated, View, Text, Image, StyleSheet } from "react-native";
import { colors, radius, fonts, shadow } from "../theme/tokens";

export default function PolaroidCard({ item, slotLabel, rotation = 0, delay = 0 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: 1,
      delay,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: progress,
    transform: [
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }) },
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
      { rotate: `${rotation}deg` },
    ],
  };

  return (
    <Animated.View style={[styles.card, shadow.float, animatedStyle]}>
      <View style={styles.imageWrap}>
        {item?.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderInitial}>{item?.category?.[0]?.toUpperCase() ?? "?"}</Text>
          </View>
        )}
      </View>
      <Text style={styles.slotLabel}>{slotLabel}</Text>
      <Text style={styles.itemName} numberOfLines={1}>
        {item?.name ?? "Not in this look"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ivory,
    borderRadius: radius.md,
    padding: 8,
    paddingBottom: 12,
    width: 132,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 0.85,
    borderRadius: radius.sm,
    overflow: "hidden",
    backgroundColor: colors.bone,
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderInitial: { fontFamily: fonts.serif, fontSize: 28, color: colors.smoke },
  slotLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.gold,
    fontWeight: "700",
  },
  itemName: {
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.obsidian,
    marginTop: 2,
  },
});
