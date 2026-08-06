import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../src/context/AppContext";
import PrimaryButton from "../src/components/PrimaryButton";
import { colors, radius, fonts, spacing } from "../src/theme/tokens";

const SEASONS = ["Summer", "Winter", "All Season"];

export default function AddItemScreen() {
  const { addClothingItem } = useAppState();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [composition, setComposition] = useState("");
  const [season, setSeason] = useState(SEASONS[2]);
  const [imageUri, setImageUri] = useState(null);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  }

  function handleSave() {
    if (!name.trim() || !category.trim()) return;
    addClothingItem({ name, category, color, composition, season, imageUri });
    router.back();
  }

  const isValid = name.trim().length > 0 && category.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add To Archive</Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.obsidian} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.imagePicker} onPress={handlePickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={28} color={colors.smoke} />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </Pressable>

        <Field label="Piece Name" value={name} onChangeText={setName} placeholder="Silk Slip Dress" />
        <Field label="Category" value={category} onChangeText={setCategory} placeholder="Dress" />
        <Field label="Colorway" value={color} onChangeText={setColor} placeholder="Ivory" />
        <Field
          label="Composition"
          value={composition}
          onChangeText={setComposition}
          placeholder="100% Mulberry Silk"
        />

        <Text style={styles.label}>Season</Text>
        <View style={styles.seasonRow}>
          {SEASONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setSeason(s)}
              style={[styles.seasonChip, season === s && styles.seasonChipActive]}
            >
              <Text style={[styles.seasonChipText, season === s && styles.seasonChipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Save Piece" onPress={handleSave} disabled={!isValid} />
      </View>
    </SafeAreaView>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.smoke} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
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
    fontSize: 18,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.obsidian,
  },
  body: { padding: spacing.lg },
  imagePicker: {
    height: 180,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.bone,
    marginBottom: spacing.lg,
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.smoke,
    textTransform: "uppercase",
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.smoke,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.obsidian,
    backgroundColor: colors.ivory,
  },
  seasonRow: { flexDirection: "row", gap: 8 },
  seasonChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  seasonChipActive: { backgroundColor: colors.obsidian, borderColor: colors.obsidian },
  seasonChipText: { fontSize: 12, color: colors.charcoal },
  seasonChipTextActive: { color: colors.ivory },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
});
