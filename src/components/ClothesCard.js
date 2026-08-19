import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { colors, radius, fonts, shadow } from "../theme/tokens";

export default function ClothesCard({ item, onPress }) {
  if (!item?.imageUri) {
    console.error(`[ClothesCard] refusing to render item ${item?.id ?? "unknown"} — missing imageUri`);
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 10,
    margin: 6,
  },
  pressed: { opacity: 0.9 },
  imageWrap: {
    borderRadius: radius.md,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: colors.hairline,
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%" },
  name: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.charcoal,
  },
});
