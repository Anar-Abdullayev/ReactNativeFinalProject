import AddButton from "@/components/buttons/AddButton";
import TaskCard from "@/components/TaskCard";
import { fetchTasks } from "@/database/db";
import { RootState } from "@/store/store";
import { setTasks } from "@/store/tasks/tasksSlice";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function TasksListScreen({navigation}:any) {
  const tasks = useSelector((state: RootState) => state.tasks.list);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<"all" | "completed" | "uncompleted">(
    "all"
  );
  
  useEffect(() => {
    const fetchTasksAsync = async () => {
      const data = await fetchTasks(filter);
      dispatch(setTasks(data));
    };

    fetchTasksAsync();
  }, [filter]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TaskFilterHeader filter={filter} setFilter={setFilter} />
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <TaskCard task={item}/>}
      />

      <AddButton onPress={() => {navigation.navigate('taskadd')}} />
    </View>
  );
}


const TaskFilterHeader = ({filter, setFilter}: any) => {

  return (
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
  )
}