import InitialLaunch from "@/components/InitialLaunch";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import HomeScreen from "../screens/HomeScreen";
import NewsScreen from "../screens/NewsScreen";
import NotesListScreen from "../screens/NotesScreen";
import TaskAddScreen from "../screens/TaskAddScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TasksScreen from "../screens/TasksScreen";
import WeatherScreen from "../screens/WeatherScreen";

import { useTranslation } from 'react-i18next';
import '../../lib/translation';


const MyStack = createStackNavigator();
export default function HomeStack({ navigation }: any) {
  const [initialLaunch, setInitialLaunch] = useState(true);
  const { t } = useTranslation();
  if (initialLaunch) {
    return (
      <InitialLaunch onFinish={() => setInitialLaunch(false)} finishTime={2000} />
    );
  }
  return (
    <MyStack.Navigator>
      <MyStack.Screen
        name="homecards"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <MyStack.Screen
        name="tasks"
        component={TasksScreen}
        options={{ title: t('tasksLabel') }}
      />
      <MyStack.Screen
        name="taskdetail"
        component={TaskDetailScreen}
        options={{ title: t('detailsLabel') }}
      />
      <MyStack.Screen
        name="taskadd"
        component={TaskAddScreen}
        options={{ title: t('newTaskLabel') }}
      />
      <MyStack.Screen
        name="notes"
        component={NotesListScreen}
        options={{ title: t('notesLabel') }}
      />
      <MyStack.Screen
        name="weather"
        component={WeatherScreen}
        options={{ title: t('weatherLabel') }}
      />
      <MyStack.Screen
        name="news"
        component={NewsScreen}
        options={{ title: t('newsLabel') }}
      />
    </MyStack.Navigator>
  );
}
