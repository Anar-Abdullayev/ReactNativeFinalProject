import NoteModal from "@/components/AddNoteModal";
import AddButton from "@/components/buttons/AddButton";
import NoteContainer from "@/components/NoteContainer";
import { Note } from "@/constants/Note";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Guid } from "js-guid";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    PanResponder,
    PanResponderGestureState,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const STORAGE_KEY = "NOTES";

const NotesListScreen = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const positions = useRef<Record<string, Animated.ValueXY>>({});
  const [zIndexCounter, setZIndexCounter] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const savedNotes: Note[] = JSON.parse(json);
      setNotes(savedNotes);
      savedNotes.forEach((note) => {
        positions.current[note.id] = new Animated.ValueXY({
          x: note.x,
          y: note.y,
        });
      });
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const createPanResponder = (note: Note) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        positions.current[note.id].setOffset(
          (positions.current[note.id] as any).__getValue()
        );
        positions.current[note.id].setValue({ x: 0, y: 0 });

        const updatedNotes = notes.map((n) =>
          n.id === note.id ? { ...n, zIndex: zIndexCounter + 1 } : n
        );
        setZIndexCounter(zIndexCounter + 1);
        setNotes(updatedNotes);
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: positions.current[note.id].x,
            dy: positions.current[note.id].y,
          },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture: PanResponderGestureState) => {
        positions.current[note.id].flattenOffset();

        const newX = (positions.current[note.id].x as any).__getValue();
        const newY = (positions.current[note.id].y as any).__getValue();

        const updatedNotes = notes.map((n) =>
          n.id === note.id ? { ...n, x: newX, y: newY } : n
        );
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
      },
    });

  const handleLongPress = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, isEditing: true }
          : { ...note, isEditing: false }
      )
    );
  };
  const editNote = (id: string) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNoteToEdit(noteToEdit);
      setModalVisible(true);
    }
  };

  const deleteNote = async (id: string) => {
    await saveNotes(notes.filter((note) => note.id !== id));
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const clearEditMode = () => {
    setNotes((prev) => prev.map((note) => ({ ...note, isEditing: false })));
    setNoteToEdit(null);
  };

  const handleAddNoteClick = () => {
    setModalVisible(true);
  };

  const handleSaveNote = async (note: Note) => {
    console.log("Saving note:", note);
    if (note.id !== Guid.EMPTY) {
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, ...note } : n))
      );
      saveNotes(notes);
    } else {
      const newNote: Note = {
        ...note,
        id: Guid.newGuid().toString(),
      };
      positions.current[newNote.id] = new Animated.ValueXY({
        x: note.x,
        y: note.y,
      });
      await saveNotes([...notes, newNote]);
      setNotes((prev) => [...prev, newNote]);
    }
  };
  const renderNotes = () =>
    notes.map((note) => {
      if (!positions.current[note.id]) {
        positions.current[note.id] = new Animated.ValueXY({
          x: note.x,
          y: note.y,
        });
      }

      const panResponder = createPanResponder(note);

      return (
        <NoteContainer
          key={note.id}
          note={note}
          onLongPress={handleLongPress}
          onEdit={editNote}
          onDelete={deleteNote}
          panResponder={panResponder}
          transformPosition={
            positions.current[note.id].getTranslateTransform() ?? []
          }
        />
      );
    });
  return (
    <TouchableWithoutFeedback onPress={() => clearEditMode()}>
      <View style={styles.container}>
        {renderNotes()}
        <NoteModal
          onClose={() => {
            setNoteToEdit(null);
            setModalVisible(false)
          }}
          onSave={handleSaveNote}
          visible={modalVisible}
          noteToEdit={noteToEdit}
        />
        <AddButton onPress={handleAddNoteClick} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NotesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8ff",
  },
});
