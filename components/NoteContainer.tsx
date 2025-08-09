import { Note } from "@/constants/Note";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";


interface NoteContainerProps {
    note: Note;
    onLongPress: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    transformPosition: any;
    panResponder: any;
}


export default function NoteContainer({ note, onLongPress, onEdit, onDelete, transformPosition, panResponder }: NoteContainerProps) {
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.note,
        {
          transform: transformPosition,
          zIndex: note.zIndex,
        },
      ]}
    >
      <Text style={{fontSize:20}} onLongPress={() => onLongPress(note.id)}>{note.title}</Text>
      {note.isEditing && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => onEdit(note.id)}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(note.id)}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8ff",
  },
  note: {
    position: "absolute",
    backgroundColor: "#ffe4b5",
    padding: 16,
    borderColor: 'black',
    borderWidth:1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
  },
});