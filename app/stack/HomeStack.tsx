import { store } from "@/store/store";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import HomeScreen from "../screens/HomeScreen";
import NotesListScreen from "../screens/NotesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TasksScreen from "../screens/TasksScreen";

const MyStack = createStackNavigator();
export default function HomeStack() {
  return (
    <Provider store={store}>
      <MyStack.Navigator>
        <MyStack.Screen
          name="homecards"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <MyStack.Screen
          name="profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
        <MyStack.Screen
          name="tasks"
          component={TasksScreen}
          options={{ title: "Tasks" }}
        />
        <MyStack.Screen
          name="taskdetail"
          component={TaskDetailScreen}
          options={{ title: "Details" }}
        />
        <MyStack.Screen
          name="notes"
          component={NotesListScreen}
          options={{ title: "Notes" }}
        />
      </MyStack.Navigator>
    </Provider>
  );
}
