import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Animated } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/context/AppContext";
import ClothesCard from "../src/components/ClothesCard";
import CupboardLogo from "../src/components/CupboardLogo";
import AddItemDrawer from "../src/components/AddItemDrawer";
import { categorizeItem } from "../src/utils/categorize";
import { colors, radius, fonts, shadow, spacing } from "../src/theme/tokens";

const TABS = [
  { key: "ALL", label: "All Items" },
  { key: "top", label: "Tops" },
  { key: "bottom", label: "Bottoms" },
];

const SOCIAL_PROOF = [
  "Sara upgraded to Infinite Style plan",
  "Ayesha just curated her 3rd look this week",
  "Zara added 5 pieces to her archive",
  "Fatima unlocked Infinite Style",
];

function buildBentoRows(items) {
  const rows = [];
  let i = 0;
  while (i < items.length) {
    if (rows.length % 2 === 0) {
      rows.push({ id: `row-${i}`, type: "hero", items: [items[i]] });
      i += 1;
    } else {
      rows.push({ id: `row-${i}`, type: "pair", items: items.slice(i, i + 2) });
      i += 2;
    }
  }
  return rows;
}

function SocialProofTicker() {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setIndex((prev) => (prev + 1) % SOCIAL_PROOF.length), 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.ticker}>
      <Animated.Text style={[styles.tickerText, { opacity }]} numberOfLines={1}>
        ✦ {SOCIAL_PROOF[index]} ✦
      </Animated.Text>
    </View>
  );
}

export default function HomeScreen() {
  const { clothesList, maxStorage, aiCredits } = useAppState();
  const params = useLocalSearchParams();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    if (params.openAdd === "1") {
      setDrawerVisible(true);
      router.setParams({ openAdd: undefined });
    }
  }, [params.openAdd]);

  const filteredList = useMemo(() => {
    if (activeTab === "ALL") return clothesList;
    return clothesList.filter((item) => categorizeItem(item) === activeTab);
  }, [clothesList, activeTab]);

  const rows = useMemo(() => buildBentoRows(filteredList), [filteredList]);

  function handleAddPress() {
    if (clothesList.length >= maxStorage) {
      router.push("/checkout");
      return;
    }
    setDrawerVisible(true);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.navBar}>
        <Ionicons name="menu-outline" size={22} color={colors.charcoal} />
        <CupboardLogo size="sm" />
        <Pressable onPress={() => router.push("/checkout")} style={styles.creditPill}>
          <Text style={styles.creditPillText}>{aiCredits} Credits</Text>
        </Pressable>
      </View>

      <SocialProofTicker />

      <FlatList
        data={rows}
        keyExtractor={(row) => row.id}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.title}>Main Archive</Text>
            <Text style={styles.subtitle}>Curated selections for the modern wardrobe.</Text>
            <View style={styles.tabRow}>
              {TABS.map((tab) => (
                <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.tab}>
                  <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                    {tab.label.toUpperCase()}
                  </Text>
                  {activeTab === tab.key && <View style={styles.tabUnderline} />}
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Your archive is empty.{"\n"}Add your first piece to begin.</Text>
          </View>
        }
        renderItem={({ item: row }) =>
          row.type === "hero" ? (
            <View style={styles.heroRow}>
              <ClothesCard
                item={row.items[0]}
                span="full"
                onPress={() => router.push(`/item/${row.items[0].id}`)}
              />
            </View>
          ) : (
            <View style={styles.pairRow}>
              {row.items.map((item) => (
                <ClothesCard key={item.id} item={item} onPress={() => router.push(`/item/${item.id}`)} />
              ))}
            </View>
          )
        }
      />

      <Pressable onPress={handleAddPress} style={[styles.addButton, shadow.float]}>
        <Ionicons name="add" size={26} color={colors.ivory} />
      </Pressable>

      <AddItemDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  creditPill: {
    backgroundColor: colors.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  creditPillText: {
    color: colors.ivory,
    fontSize: 11,
    fontWeight: "700",
  },
  ticker: {
    backgroundColor: colors.surfaceTan,
    paddingVertical: 7,
    alignItems: "center",
  },
  tickerText: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.charcoalSoft,
    fontWeight: "600",
  },
  listHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: 13,
    color: colors.smoke,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  tab: { paddingBottom: 10 },
  tabText: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.smoke,
    fontWeight: "600",
  },
  tabTextActive: { color: colors.charcoal },
  tabUnderline: {
    marginTop: 8,
    height: 2,
    backgroundColor: colors.charcoal,
  },
  grid: { paddingHorizontal: spacing.sm, paddingBottom: 120 },
  heroRow: { paddingHorizontal: 0 },
  pairRow: { flexDirection: "row" },
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
    bottom: spacing.xl,
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
});
