import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import { processPayment, cancelPayment, PAYMENT_METHODS } from "../src/services/mockPaymentService";
import PrimaryButton from "../src/components/PrimaryButton";
import { colors, radius, fonts, spacing, shadow } from "../src/theme/tokens";

const PLANS = {
  TOPUP: { key: "TOPUP", label: "+5 AI CREDITS", price: 50, detail: "Keep 10 items · Add 5 credits" },
  INFINITE: {
    key: "INFINITE",
    label: "INFINITE STYLE",
    price: 500,
    detail: "Expand closet to 20 items + 15 credits/mo",
    suffix: "/ mo",
  },
};

const METHOD_LABELS = { JAZZCASH: "JazzCash", EASYPAISA: "EasyPaisa", CARD: "Card" };

function formatExpiry(raw) {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutScreen() {
  const { applyMicroTopUp, applyInfiniteStyle } = useAppState();
  const [plan, setPlan] = useState(PLANS.TOPUP.key);
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const selectedPlan = PLANS[plan];
  const isCard = method === "CARD";

  async function handleCompletePayment() {
    if (isCard) {
      if (!cardholderName.trim() || !accountNumber.trim() || expiryDate.length < 5 || cvv.trim().length < 3) {
        setBanner({ tone: "error", message: "Fill in all card details" });
        return;
      }
    } else if (!accountNumber.trim()) {
      setBanner({ tone: "error", message: "Enter a wallet number" });
      return;
    }

    setBanner(null);
    setLoading(true);

    const result = await processPayment({
      method,
      amount: selectedPlan.price,
      accountNumber,
    });

    setLoading(false);

    if (result.status === "SUCCESS") {
      if (plan === "TOPUP") applyMicroTopUp();
      else applyInfiniteStyle();

      setBanner({ tone: "success", message: `Payment confirmed · ${result.transactionId}` });
      setTimeout(() => router.back(), 1400);
    } else {
      setBanner({ tone: "error", message: result.message });
    }
  }

  function handleCancel() {
    const result = cancelPayment();
    setBanner({ tone: "neutral", message: result.message });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upgrade Your Archive</Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.charcoal} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {Object.values(PLANS).map((p) => (
          <Pressable
            key={p.key}
            onPress={() => setPlan(p.key)}
            style={[styles.planCard, shadow.card, plan === p.key && styles.planCardActive]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.planLabel, plan === p.key && styles.planLabelActive]}>{p.label}</Text>
              <Text style={[styles.planDetail, plan === p.key && styles.planDetailActive]}>{p.detail}</Text>
            </View>
            <Text style={[styles.planPrice, plan === p.key && styles.planLabelActive]}>
              Rs. {p.price}
              {p.suffix ?? ""}
            </Text>
          </Pressable>
        ))}

        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.methodRow}>
          {PAYMENT_METHODS.map((m) => (
            <Pressable
              key={m}
              onPress={() => setMethod(m)}
              style={[styles.methodTab, method === m && styles.methodTabActive]}
            >
              <Text style={[styles.methodTabText, method === m && styles.methodTabTextActive]}>
                {METHOD_LABELS[m]}
              </Text>
            </Pressable>
          ))}
        </View>

        {isCard ? (
          <>
            <Text style={styles.sectionLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="Ayesha Khan"
              placeholderTextColor={colors.smoke}
              autoCapitalize="words"
            />

            <Text style={styles.sectionLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="4242 4242 4242 4242"
              placeholderTextColor={colors.smoke}
              keyboardType="number-pad"
              maxLength={19}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardRowField}>
                <Text style={styles.sectionLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiry(text))}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.smoke}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.cardRowField}>
                <Text style={styles.sectionLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/[^0-9]/g, "").slice(0, 4))}
                  placeholder="123"
                  placeholderTextColor={colors.smoke}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>
            <Text style={styles.hint}>Sandbox tip: a card number ending in 0000 simulates a failed payment.</Text>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Wallet Number</Text>
            <TextInput
              style={styles.input}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="03xx xxxxxxx"
              placeholderTextColor={colors.smoke}
              keyboardType="number-pad"
            />
            <Text style={styles.hint}>Sandbox tip: a wallet number ending in 0000 simulates a failed payment.</Text>
          </>
        )}

        {banner && (
          <View
            style={[
              styles.banner,
              banner.tone === "success" && styles.bannerSuccess,
              banner.tone === "error" && styles.bannerError,
              banner.tone === "neutral" && styles.bannerNeutral,
            ]}
          >
            <Text style={styles.bannerText}>{banner.message}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Cancel" variant="light" onPress={handleCancel} style={{ marginBottom: 10 }} />
        <PrimaryButton label="Complete Payment" onPress={handleCompletePayment} loading={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.charcoal,
  },
  body: { padding: spacing.lg },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  planCardActive: { borderColor: colors.charcoal },
  planLabel: {
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: "700",
    color: colors.charcoal,
  },
  planLabelActive: { color: colors.charcoal },
  planDetail: { fontSize: 12, color: colors.smoke, marginTop: 4 },
  planDetailActive: { color: colors.charcoal },
  planPrice: { fontFamily: fonts.serif, fontSize: 16, color: colors.charcoal },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.smoke,
    marginTop: spacing.md,
    marginBottom: 8,
    fontWeight: "600",
  },
  methodRow: { flexDirection: "row", gap: 8 },
  methodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: "center",
    backgroundColor: colors.ivory,
  },
  methodTabActive: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  methodTabText: { fontSize: 12, fontWeight: "600", color: colors.charcoal },
  methodTabTextActive: { color: colors.ivory },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.charcoal,
    backgroundColor: colors.ivory,
    marginBottom: spacing.md,
  },
  hint: { fontSize: 11, color: colors.smoke, marginTop: -4 },
  cardRow: { flexDirection: "row", gap: 12 },
  cardRowField: { flex: 1 },
  banner: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  bannerSuccess: { backgroundColor: "#E4F1EA" },
  bannerError: { backgroundColor: "#F6E2E0" },
  bannerNeutral: { backgroundColor: colors.hairline },
  bannerText: { fontSize: 13, color: colors.charcoal, fontWeight: "600" },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
});
