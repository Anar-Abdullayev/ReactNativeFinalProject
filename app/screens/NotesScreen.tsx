import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    PanResponder,
    PanResponderGestureState,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

type Note = {
    id: string;
    text: string;
    x: number;
    y: number;
    zIndex: number;
    isEditing?: boolean;
};

const STORAGE_KEY = 'NOTES';

const NotesListScreen = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const positions = useRef<Record<string, Animated.ValueXY>>({});
    const [zIndexCounter, setZIndexCounter] = useState(1);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                const savedNotes: Note[] = JSON.parse(json);
                setNotes(savedNotes);

                // Set up positions
                savedNotes.forEach(note => {
                    positions.current[note.id] = new Animated.ValueXY({ x: note.x, y: note.y });
                });
            }
        } catch (error) {
            console.error('Failed to load notes', error);
        }
    };

    const saveNotes = async (updatedNotes: Note[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        } catch (error) {
            console.error('Failed to save notes', error);
        }
    };

    const createPanResponder = (note: Note) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                positions.current[note.id].setOffset((positions.current[note.id] as any).__getValue());
                positions.current[note.id].setValue({ x: 0, y: 0 });

                const updatedNotes = notes.map(n =>
                    n.id === note.id ? { ...n, zIndex: zIndexCounter + 1 } : n
                );
                setZIndexCounter(zIndexCounter + 1);
                setNotes(updatedNotes);
            },
            onPanResponderMove: Animated.event(
                [null, { dx: positions.current[note.id].x, dy: positions.current[note.id].y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture: PanResponderGestureState) => {
                positions.current[note.id].flattenOffset();

                const newX = (positions.current[note.id].x as any).__getValue();
                const newY = (positions.current[note.id].y as any).__getValue();

                const updatedNotes = notes.map(n =>
                    n.id === note.id ? { ...n, x: newX, y: newY } : n
                );
                setNotes(updatedNotes);
                saveNotes(updatedNotes);
            },
        });
        
    const handleLongPress = (id: string) => {
        setNotes(prev =>
            prev.map(note =>
                note.id === id
                    ? { ...note, isEditing: true }
                    : { ...note, isEditing: false }
            )
        );
    };
    const editNote = (id: string) => {
        console.log('Edit', id);
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    };
    const clearEditMode = () => {
        setNotes(prev => prev.map(note => ({ ...note, isEditing: false })));
    };
    const renderNotes = () =>
        notes.map(note => {
            if (!positions.current[note.id]) {
                positions.current[note.id] = new Animated.ValueXY({ x: note.x, y: note.y });
            }

            const panResponder = createPanResponder(note);

            return (
                <TouchableWithoutFeedback onLongPress={() => handleLongPress(note.id)}>
                    <Animated.View style={[styles.note, { transform: positions.current[note.id]?.getTranslateTransform() ?? [] }]}>
                        <Text>{note.text}</Text>
                        {note.isEditing && (
                            <View style={styles.buttons}>
                                <TouchableOpacity onPress={() => editNote(note.id)}>
                                    <Text>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteNote(note.id)}>
                                    <Text>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Animated.View>
                </TouchableWithoutFeedback>
            );
        });

    return <TouchableWithoutFeedback onPress={() => clearEditMode()}>
        <View style={styles.container}>
            {renderNotes()}
        </View>
    </TouchableWithoutFeedback>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8ff',
    },
    note: {
        position: 'absolute',
        backgroundColor: '#ffe4b5',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 2, height: 2 },
    },
    noteText: {
        fontSize: 16,
        color: '#333',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: -15,
        left: 0,
        right: 0,
    },
});

export default NotesListScreen;
