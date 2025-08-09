import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddButton({ onPress }: { onPress: () => void }) {
    const insets = useSafeAreaInsets();
    return (
        <TouchableOpacity
            style={[styles.addButton, { bottom: insets.bottom + 20 }]}
            onPress={onPress}
        >
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        right: 20,
        width: 60,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        borderRadius: 30,
        shadowColor: '#000',
    },
    addButtonText: {
        fontSize: 36,
        color: '#fff',
    }
})