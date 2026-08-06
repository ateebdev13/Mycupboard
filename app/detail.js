import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import PrimaryButton from "../src/components/PrimaryButton";
import { colors, radius, fonts, spacing } from "../src/theme/tokens";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const { clothesList, removeClothingItem } = useAppState();
  const item = clothesList.find((c) => c.id === id);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.missing}>This piece is no longer in your archive.</Text>
      </SafeAreaView>
    );
  }

  function handleRemove() {
    Alert.alert("Remove Piece", `Remove "${item.name}" from your archive?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          removeClothingItem(item.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.garmentId}>{item.id}</Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.obsidian} />
        </Pressable>
      </View>

      <View style={styles.imageWrap}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderInitial}>{item.category?.[0]?.toUpperCase() ?? "M"}</Text>
          </View>
        )}
      </View>

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.category}>{item.category}</Text>

      <View style={styles.metaGrid}>
        <MetaRow label="Composition" value={item.composition} />
        <MetaRow label="Colorway" value={item.color} />
        <MetaRow label="Season" value={item.season} />
        <MetaRow label="Wear Count" value={`${item.wearCount} times`} />
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Remove Piece" onPress={handleRemove} variant="light" />
      </View>
    </SafeAreaView>
  );
}

function MetaRow({ label, value }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory, paddingHorizontal: spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  garmentId: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.smoke,
    fontWeight: "600",
  },
  imageWrap: {
    height: 320,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.bone,
    marginBottom: spacing.lg,
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderInitial: { fontFamily: fonts.serif, fontSize: 56, color: colors.smoke },
  name: { fontFamily: fonts.serif, fontSize: 24, color: colors.obsidian },
  category: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.smoke,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  metaGrid: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  metaLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.smoke,
  },
  metaValue: { fontSize: 14, color: colors.obsidian, fontFamily: fonts.serif },
  footer: { marginTop: "auto", paddingVertical: spacing.lg },
  missing: { textAlign: "center", marginTop: spacing.xxl, color: colors.smoke },
});
