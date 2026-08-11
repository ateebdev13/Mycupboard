import { useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, fonts, spacing } from "../theme/tokens";

export default function RatingModal({ visible, onSubmit, onSkip }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  function reset() {
    setRating(0);
    setFeedback("");
  }

  function handleSubmit() {
    console.log("[RatingModal] feedback submitted:", { rating, feedback });
    reset();
    onSubmit();
  }

  function handleSkip() {
    reset();
    onSkip();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleSkip}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>How did we do?</Text>
          <Text style={styles.subtitle}>
            Your feedback helps refine the Stylist AI's future suggestions.
          </Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={6}>
                <Ionicons
                  name={n <= rating ? "star" : "star-outline"}
                  size={28}
                  color={n <= rating ? colors.gold : colors.hairline}
                  style={styles.star}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Tell us more about this match..."
            placeholderTextColor={colors.smoke}
            multiline
          />

          <Pressable onPress={handleSubmit} disabled={rating === 0} style={[styles.submit, rating === 0 && styles.submitDisabled]}>
            <Text style={styles.submitText}>Submit Feedback</Text>
          </Pressable>

          <Pressable onPress={handleSkip}>
            <Text style={styles.skip}>SKIP</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30,27,23,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.smoke,
    textAlign: "center",
    marginTop: 8,
    marginBottom: spacing.lg,
  },
  stars: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.lg,
  },
  star: {},
  input: {
    width: "100%",
    minHeight: 64,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.charcoal,
    backgroundColor: colors.canvas,
    textAlignVertical: "top",
    marginBottom: spacing.lg,
  },
  submit: {
    width: "100%",
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: {
    color: colors.ivory,
    fontSize: 13,
    fontWeight: "600",
  },
  skip: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.smoke,
    fontWeight: "600",
  },
});
