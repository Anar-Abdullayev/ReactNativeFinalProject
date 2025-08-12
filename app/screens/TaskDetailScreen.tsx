import { Task } from "@/constants/Task";
import { tasksService } from "@/database/db";
import { removeTask, updateTask } from "@/store/tasks/tasksSlice";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";
import { useDispatch } from "react-redux";

type RootStackParamList = {
  TaskDetail: { taskId: number };
};

type TaskDetailRouteProp = RouteProp<RootStackParamList, "TaskDetail">;

export default function TaskDetailScreen() {
  const route = useRoute<TaskDetailRouteProp>();
  const navigation = useNavigation<any>();
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
 const dispatch = useDispatch();
  useEffect(() => {
    const getTask = async () => {
      const data = await tasksService.fetchTaskById(taskId);
      navigation.setOptions({ title: data?.title || "Task Details" });
      setTask(data);
    };
    getTask();
  }, [taskId]);

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading task...</Text>
      </View>
    );
  }

  const handleToggleComplete = async () => {
    await tasksService.updateTaskStatus(task.id, !task.is_completed);
    setTask({ ...task, is_completed: task.is_completed === 1 ? 0 : 1 });
    const payload: any = {
      taskId,
      isCompleted: task.is_completed === 1 ? false : true,
    };
    dispatch(updateTask(payload))
  };

  const handleDelete = async () => {
    await tasksService.deleteTask(task.id);
    dispatch(removeTask(task.id));
    navigation.goBack();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Card>
        <Card.Content>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text variant="titleLarge">{task.title}</Text>
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
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              Deadline: {task.deadline}
            </Text>
          )}

          {task.description && (
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              {task.description}
            </Text>
          )}
        </Card.Content>
      </Card>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 20,
        }}
      >
        <Button
          mode={task.is_completed ? "outlined" : "contained"}
          onPress={handleToggleComplete}
        >
          {task.is_completed ? "Mark as Pending" : "Mark as Done"}
        </Button>

        <Button
          mode="outlined"
          buttonColor="#ffcccc"
          textColor="red"
          onPress={handleDelete}
        >
          Delete
        </Button>
      </View>
    </ScrollView>
  );
}
