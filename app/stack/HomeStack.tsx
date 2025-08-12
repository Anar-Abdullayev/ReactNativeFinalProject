import { store } from "@/store/store";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import HomeScreen from "../screens/HomeScreen";
import NewsScreen from "../screens/NewsScreen";
import NotesListScreen from "../screens/NotesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TaskAddScreen from "../screens/TaskAddScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TasksScreen from "../screens/TasksScreen";
import WeatherScreen from "../screens/WeatherScreen";

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
          name="taskadd"
          component={TaskAddScreen}
          options={{ title: "New Task" }}
        />
        <MyStack.Screen
          name="notes"
          component={NotesListScreen}
          options={{ title: "Notes" }}
        />
        <MyStack.Screen
          name="weather"
          component={WeatherScreen}
          options={{ title: "Weather Forecast" }}
        />
        <MyStack.Screen
          name="news"
          component={NewsScreen}
          options={{ title: "News" }}
        />
      </MyStack.Navigator>
    </Provider>
  );
}
