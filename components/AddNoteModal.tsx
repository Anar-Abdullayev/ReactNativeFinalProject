import { Note } from "@/constants/Note";
import { Guid } from "js-guid";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTranslation } from 'react-i18next';
import '../lib/translation';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  noteToEdit?: Note | null; // if null → add mode, if object → edit mode
};

export default function NoteModal({
  visible,
  onClose,
  onSave,
  noteToEdit,
}: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setDescription(noteToEdit.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [noteToEdit, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Empty Title', 'Title cannot be empty!')
      return;
    }
    const note: Note = {
      id: noteToEdit?.id || Guid.EMPTY,
      title: title.trim(),
      description: description.trim(),
      x: noteToEdit?.x || 0,
      y: noteToEdit?.y || 0,
      zIndex: noteToEdit?.zIndex || 0,
      isEditing: false,
    };
    onSave(note);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            {noteToEdit ? t('headerEditNote') : t('headerAddNote')}
          </Text>

          <TextInput
            placeholder={t('titlePlaceholder')}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder={t('descriptionPlaceholder')}
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t('btnCancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.save]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                {noteToEdit ? t('btnUpdate') : t('btnAdd')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: "#999",
  },
  save: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
