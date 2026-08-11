import { useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAppState } from "../context/AppContext";
import { colors, radius, fonts, spacing } from "../theme/tokens";

export default function AddItemDrawer({ visible, onClose }) {
  const { addClothingItem } = useAppState();
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState(null);

  function reset() {
    setName("");
    setImageUri(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleBrowseGallery() {
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

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  }

  function handleSave() {
    if (!name.trim() || !imageUri) return;
    addClothingItem({ name: name.trim(), imageUri });
    reset();
    onClose();
  }

  const isValid = name.trim().length > 0 && !!imageUri;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Add to Archive</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.charcoal} />
            </Pressable>
          </View>

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Cashmere Sweater"
            placeholderTextColor={colors.smoke}
          />

          {imageUri ? (
            <Pressable style={styles.previewRow} onPress={handleBrowseGallery}>
              <Image source={{ uri: imageUri }} style={styles.previewThumb} resizeMode="cover" />
              <Text style={styles.previewChange}>Change Photo</Text>
            </Pressable>
          ) : (
            <View style={styles.sourceRow}>
              <Pressable style={styles.sourceButton} onPress={handleTakePhoto}>
                <Ionicons name="camera-outline" size={22} color={colors.charcoal} />
                <Text style={styles.sourceButtonText}>Take Photo</Text>
              </Pressable>
              <Pressable style={styles.sourceButton} onPress={handleBrowseGallery}>
                <Ionicons name="image-outline" size={22} color={colors.charcoal} />
                <Text style={styles.sourceButtonText}>Browse Gallery</Text>
              </Pressable>
            </View>
          )}

          {!imageUri && <Text style={styles.hint}>A photo is required to add this piece.</Text>}

          <Pressable
            onPress={handleSave}
            disabled={!isValid}
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>Save Item</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30,27,23,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.hairline,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.charcoal,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.smoke,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.charcoal,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  sourceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.lg,
  },
  sourceButton: {
    flex: 1,
    aspectRatio: 1.3,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sourceButtonText: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.charcoalSoft,
    fontWeight: "600",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: spacing.lg,
  },
  previewThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.hairline,
  },
  previewChange: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: "600",
  },
  hint: {
    fontSize: 11,
    color: colors.smoke,
    marginBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: {
    color: colors.ivory,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
  },
});
