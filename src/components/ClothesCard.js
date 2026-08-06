import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { colors, radius, fonts, shadow } from "../theme/tokens";

export default function ClothesCard({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderInitial}>{item.category?.[0]?.toUpperCase() ?? "M"}</Text>
          </View>
        )}
        <View style={styles.wearBadge}>
          <Text style={styles.wearBadgeText}>{item.wearCount}×</Text>
        </View>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {item.category} · {item.color}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    padding: 10,
    margin: 6,
  },
  pressed: { opacity: 0.9 },
  imageWrap: {
    borderRadius: radius.md,
    overflow: "hidden",
    aspectRatio: 0.85,
    backgroundColor: colors.hairline,
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bone,
  },
  placeholderInitial: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.smoke,
  },
  wearBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(10,10,10,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  wearBadgeText: {
    color: colors.ivory,
    fontSize: 10,
    fontWeight: "700",
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.obsidian,
  },
  meta: {
    fontFamily: fonts.system,
    fontSize: 11,
    color: colors.smoke,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
