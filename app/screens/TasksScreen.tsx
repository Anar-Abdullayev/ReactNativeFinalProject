import AddButton from "@/components/buttons/AddButton";
import { Task } from "@/constants/Task";
import { fetchTasks } from "@/database/db";
import { RootState } from "@/store/store";
import { setTasks } from "@/store/tasks/tasksSlice";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function TasksListScreen() {
  const tasks = useSelector((state: RootState) => state.tasks.list);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<"all" | "completed" | "uncompleted">(
    "all"
  );
  const navigation = useNavigation<any>();
  useEffect(() => {
    const fetchTasksAsync = async () => {
      const data = await fetchTasks(filter);
      dispatch(setTasks(data));
    };

    fetchTasksAsync();
  }, [filter]);

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("taskdetail", {
          taskId: item.id,
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
            <Text variant="bodyMedium">{item.title}</Text>
            <Chip
              style={{
                backgroundColor: item.is_completed ? "#c8e6c9" : "#ffcdd2",
              }}
              textStyle={{
                color: item.is_completed ? "green" : "red",
              }}
            >
              {item.is_completed ? "Done" : "Pending"}
            </Chip>
          </View>
          {item.deadline && (
            <Text variant="bodySmall">Deadline: {item.deadline}</Text>
          )}
          {item.description && (
            <Text variant="bodySmall">{item.description}</Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        <Button
          mode={filter === "all" ? "contained" : "outlined"}
          onPress={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          mode={filter === "completed" ? "contained" : "outlined"}
          onPress={() => setFilter("completed")}
        >
          Completed
        </Button>
        <Button
          mode={filter === "uncompleted" ? "contained" : "outlined"}
          onPress={() => setFilter("uncompleted")}
        >
          Pending
        </Button>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <AddButton onPress={() => {}} />
    </View>
  );
}
