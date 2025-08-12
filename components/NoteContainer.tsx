import { Note } from "@/constants/Note";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NoteContainerProps {
  note: Note;
  onLongPress: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onLayout: (id: string, width: number, height: number) => void;
  transformPosition: any;
  panResponder: any;
}

export default function NoteContainer({
  note,
  onLongPress,
  onEdit,
  onDelete,
  onLayout,
  transformPosition,
  panResponder,
}: NoteContainerProps) {
  return (
    <Animated.View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        onLayout?.(note.id, width, height);
      }}
      {...panResponder.panHandlers}
      style={[
        styles.note,
        {
          transform: transformPosition,
          zIndex: note.zIndex,
        },
      ]}
    >
      <Text style={{ fontSize: 20 }} onLongPress={() => onLongPress(note.id)}>
        {note.title}
      </Text>
      {note.isEditing && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => onEdit(note.id)}>
            <FontAwesome name="edit" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(note.id)}>
            <MaterialIcons name="delete-forever" size={20} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  note: {
    position: "absolute",
    backgroundColor: "#ffde4df3",
    padding: 16,
    borderColor: "black",
    borderWidth: 1,
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
    justifyContent: 'flex-end',
    gap: 10,
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
  },
});
