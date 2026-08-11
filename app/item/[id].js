import { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../../src/context/AppContext";
import OccasionModal from "../../src/components/OccasionModal";
import { colors, radius, fonts, spacing } from "../../src/theme/tokens";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { clothesList, removeClothingItem, aiCredits } = useAppState();
  const [occasionModalVisible, setOccasionModalVisible] = useState(false);
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

  function handleStyleAroundThis() {
    if (aiCredits <= 0) {
      router.push("/checkout");
      return;
    }
    setOccasionModalVisible(true);
  }

  function handleFindMatch(occasion) {
    setOccasionModalVisible(false);
    router.push({ pathname: "/loading", params: { occasion, anchorItemId: item.id } });
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.imageWrap}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderInitial}>{item.category?.[0]?.toUpperCase() ?? "C"}</Text>
          </View>
        )}

        <SafeAreaView edges={["top"]} style={styles.overlayBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={20} color={colors.charcoal} />
          </Pressable>
          <Pressable onPress={handleRemove} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={19} color={colors.charcoal} />
          </Pressable>
        </SafeAreaView>
      </View>

      <View style={styles.body}>
        <Text style={styles.eyebrow}>Archive Collection</Text>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.footer}>
          <Pressable onPress={handleStyleAroundThis} style={styles.styleButton}>
            <Text style={styles.styleButtonText}>✦ Style Around This Item</Text>
          </Pressable>
          <View style={styles.creditPill}>
            <Text style={styles.creditPillText}>{aiCredits} CREDITS</Text>
          </View>
        </View>
      </View>

      <OccasionModal
        visible={occasionModalVisible}
        onClose={() => setOccasionModalVisible(false)}
        onFindMatch={handleFindMatch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  imageWrap: {
    height: "56%",
    backgroundColor: colors.surfaceTan,
  },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderInitial: { fontFamily: fonts.serif, fontSize: 64, color: colors.smoke },
  overlayBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.smoke,
    fontWeight: "600",
    marginBottom: 6,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.charcoal,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  styleButton: {
    width: "100%",
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  styleButtonText: {
    color: colors.ivory,
    fontSize: 14,
    fontWeight: "600",
  },
  creditPill: {
    marginTop: 12,
    backgroundColor: colors.surfaceTan,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  creditPillText: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.charcoalSoft,
    fontWeight: "700",
  },
  missing: { textAlign: "center", marginTop: spacing.xxl, color: colors.smoke },
});
