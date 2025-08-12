import { Task } from "@/constants/Task";
import { useNavigation } from "expo-router";
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import '../lib/translation';

interface CardProps {
    task: Task
}

export default function TaskCard({ task }: CardProps) {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

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
                            {task.is_completed ? t('completedStatus') : t('pendingStatus')}
                        </Chip>
                    </View>
                    {task.deadline && (
                        <Text variant="bodySmall">{t('deadline')}: {task.deadline}</Text>
                    )}
                    {task.description && (
                        <Text variant="bodySmall">{task.description}</Text>
                    )}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}