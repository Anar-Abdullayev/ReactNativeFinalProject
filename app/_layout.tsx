import { createTables } from "@/database/db";
import { loadProfile } from "@/store/profile/profileSlice";
import { store } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider, useDispatch } from "react-redux";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HomeStack from "./stack/HomeStack";

import { useTranslation } from 'react-i18next';
import '../lib/translation';

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      const profile = await AsyncStorage.getItem("userProfile");

      setInitialRouteName(profile ? "home" : "profile");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await createTables();
    })();
  }, []);

  if (!initialRouteName) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      {initialRouteName === "profile" ? (
        <ProfileScreen onSave={() => setInitialRouteName("home")} />
      ) : (
        <DrawerWithData
          onLogOut={() => setInitialRouteName("profile")}
          initialRouteName={initialRouteName}
        />
      )}
    </Provider>
  );
}

function DrawerWithData({ onLogOut, initialRouteName }: any) {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadProfile());
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: { fontSize: 20 },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent onLogOut={onLogOut} {...props} />
      )}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        component={HomeStack}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
}

const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
    props.onLogOut();
    await AsyncStorage.removeItem("userProfile");
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "profile" }],
      })
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        labelStyle={{ fontSize: 20 }}
        icon={({ color, size }) => (
          <AntDesign name="logout" size={size} color={color} />
        )}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};
