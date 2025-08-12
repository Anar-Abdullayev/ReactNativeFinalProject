import { Task } from "@/constants/Task";
import { useNavigation } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

interface CardProps {
    task: Task
}

export default function TaskCard({ task }: CardProps) {
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("taskdetail", {
                    taskId: task.id,
                })
            }
        >
            <Card style={{ margin: 8, elevation: 3 }}>
                <Card.Content>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text variant="bodyMedium">{task.title}</Text>
                        <Chip
                            style={{
                                backgroundColor: task.is_completed ? "#c8e6c9" : "#ffcdd2",
                            }}
                            textStyle={{
                                color: task.is_completed ? "green" : "red",
                            }}
                        >
                            {task.is_completed ? "Done" : "Pending"}
                        </Chip>
                    </View>
                    {task.deadline && (
                        <Text variant="bodySmall">Deadline: {task.deadline}</Text>
                    )}
                    {task.description && (
                        <Text variant="bodySmall">{task.description}</Text>
                    )}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}