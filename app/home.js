import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/context/AppContext";
import ClothesCard from "../src/components/ClothesCard";
import { colors, radius, fonts, shadow, spacing } from "../src/theme/tokens";

export default function HomeScreen() {
  const { clothesList, maxStorage, aiCredits, userTier } = useAppState();

  function handleAddClothes() {
    if (clothesList.length >= maxStorage) {
      router.push("/checkout");
      return;
    }
    router.push("/add-item");
  }

  function handleStyleMe() {
    if (aiCredits <= 0) {
      router.push("/checkout");
      return;
    }
    router.push("/stylist-result");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MERAWARDROBE</Text>
          <Text style={styles.subtitle}>
            {userTier === "INFINITE" ? "INFINITE ARCHIVE" : "CAPSULE ARCHIVE"} · {clothesList.length}/
            {maxStorage}
          </Text>
        </View>
        <View style={styles.creditBadge}>
          <Text style={styles.creditText}>✦ {aiCredits} Credits</Text>
        </View>
      </View>

      <FlatList
        data={clothesList}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Your archive is empty.{"\n"}Add your first piece to begin.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ClothesCard item={item} onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })} />
        )}
      />

      <Pressable onPress={handleAddClothes} style={styles.addButton}>
        <Ionicons name="add" size={26} color={colors.obsidian} />
      </Pressable>

      <Pressable onPress={handleStyleMe} style={[styles.styleCta, shadow.float]}>
        <Text style={styles.styleCtaText}>✦ Style My Outfit</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bone },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    letterSpacing: 2,
    color: colors.obsidian,
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.smoke,
    marginTop: 4,
    textTransform: "uppercase",
  },
  creditBadge: {
    backgroundColor: colors.obsidian,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  creditText: {
    color: colors.ivory,
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 140,
  },
  empty: {
    marginTop: spacing.xxl,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    textAlign: "center",
    color: colors.smoke,
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
  },
  addButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: 110,
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.obsidian,
    alignItems: "center",
    justifyContent: "center",
  },
  styleCta: {
    position: "absolute",
    bottom: 34,
    alignSelf: "center",
    backgroundColor: colors.obsidian,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: radius.pill,
  },
  styleCtaText: {
    color: colors.ivory,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
