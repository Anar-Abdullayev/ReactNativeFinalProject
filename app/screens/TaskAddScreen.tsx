// TaskAddScreen.tsx
import { tasksService } from '@/database/db';
import { addTask } from '@/store/tasks/tasksSlice';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import {
    Alert,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch } from 'react-redux';
import { Task } from "../../constants/Task";


export default function TaskAddScreen({navigation} : any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const firstTimeSetDeadline = useRef(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const dispatch = useDispatch<any>();
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        console.log(firstTimeSetDeadline.current)
        if (event.type !== 'dismissed' && selectedDate) {
            const currentDeadline = deadline ? new Date(deadline) : new Date();
            currentDeadline.setFullYear(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            );
            setDeadline(currentDeadline);
            setShowTimePicker(true);
            firstTimeSetDeadline.current = false;
        }
        else if (event.type === 'dismissed' && firstTimeSetDeadline.current) {
            setDeadline(null)
        }
    };

    const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (event.type !== 'dismissed' && selectedTime) {
            const currentDeadline =  deadline ? new Date(deadline) : new Date();
            currentDeadline.setHours(selectedTime.getHours());
            currentDeadline.setMinutes(selectedTime.getMinutes());
            currentDeadline.setSeconds(0);
            currentDeadline.setMilliseconds(0);
            setDeadline(currentDeadline);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Input error', 'You can not leave title empty!')
            return;}

        let newTask: Task = {
            id: 0,
            title: title.trim(),
            description: description.trim(),
            is_completed: isCompleted ? 1 : 0,
            deadline: deadline ? deadline.toISOString() : '',
        };
        newTask = await tasksService.addTask(newTask)
        dispatch(addTask(newTask))
        navigation.goBack();
    };
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Enter task description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                    setShowDatePicker(true)
                    setDeadline(deadline ? deadline : new Date())
                }}
            >
                <Text>{deadline ? deadline.toLocaleString('az') : 'No deadline'}</Text>
                {deadline &&
                    <View style={{ position: 'absolute', right: 10, top: 10 }}>
                        <TouchableOpacity onPress={() => {
                            firstTimeSetDeadline.current = true;
                            setDeadline(null)
                        }}>
                            <MaterialIcons name="clear" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                }
            </TouchableOpacity>

            {showDatePicker && deadline && (
                <DateTimePicker
                    value={deadline}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeDate}
                />
            )}

            {showTimePicker && deadline && (
                <DateTimePicker
                    value={deadline}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeTime}
                />
            )}

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Completed</Text>
                <Switch value={isCompleted} onValueChange={setIsCompleted} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Task</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 12,
    },
    multiline: {
        height: 80,
        textAlignVertical: "top",
    },
    dateButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
