import { useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { OCCASION_GROUPS } from "../constants/occasions";
import CupboardLogo from "./CupboardLogo";
import { colors, radius, fonts, spacing } from "../theme/tokens";

export default function OccasionModal({ visible, onClose, onFindMatch }) {
  const [selected, setSelected] = useState(null);

  function handleClose() {
    setSelected(null);
    onClose();
  }

  function handleFindMatch() {
    if (!selected) return;
    const key = selected;
    setSelected(null);
    onFindMatch(key);
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="close" size={22} color={colors.charcoal} />
          </Pressable>
          <CupboardLogo size="sm" />
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.activeBadge}>
            <Ionicons name="sparkles" size={12} color={colors.accent} />
            <Text style={styles.activeBadgeText}>AI STYLIST ACTIVE</Text>
          </View>

          <Text style={styles.title}>Select the Occasion</Text>
          <Text style={styles.subtitle}>
            Choose an event context to help the AI curate the perfect ensemble from your archive.
          </Text>

          {OCCASION_GROUPS.map((group) => (
            <View key={group.label} style={styles.group}>
              <View style={styles.groupHeader}>
                <MaterialCommunityIcons name={group.icon} size={15} color={colors.smoke} />
                <Text style={styles.groupLabel}>{group.label}</Text>
              </View>
              <View style={styles.pillWrap}>
                {group.occasions.map((o) => {
                  const isSelected = selected === o.key;
                  return (
                    <Pressable
                      key={o.key}
                      onPress={() => setSelected(o.key)}
                      style={[styles.pill, isSelected && styles.pillSelected]}
                    >
                      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{o.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleFindMatch}
            disabled={!selected}
            style={[styles.findButton, !selected && styles.findButtonDisabled]}
          >
            <Text style={styles.findButtonText}>✦ Find My Match</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, alignItems: "center" },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentBg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  activeBadgeText: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.accent,
    fontWeight: "700",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.charcoal,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.smoke,
    textAlign: "center",
    marginTop: 8,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  group: { width: "100%", marginBottom: spacing.lg },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.smoke,
    fontWeight: "700",
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  pillSelected: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  pillText: {
    fontSize: 13,
    color: colors.charcoalSoft,
  },
  pillTextSelected: {
    color: colors.ivory,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  findButton: {
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  findButtonDisabled: { opacity: 0.4 },
  findButtonText: {
    color: colors.ivory,
    fontSize: 14,
    fontWeight: "600",
  },
});
