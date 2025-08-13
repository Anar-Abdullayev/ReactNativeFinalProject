import { createTables } from "@/database/db";
import { loadProfile, logoutProfile } from "@/store/profile/profileSlice";
import { loadSettings } from "@/store/settings/settingsSlice";
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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import '../lib/translation';
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HomeStack from "./stack/HomeStack";

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

function AppWrapper() {
  const dispatch = useDispatch<any>();
  const { hasProfile, loading } = useSelector((state: any) => state.profile)
  const { language, isDarkTheme } = useSelector((state: any) => state.settings)
  const { i18n } = useTranslation();
  useEffect(() => {
    dispatch(loadProfile())
    dispatch(loadSettings())
  }, [])

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language])

  useEffect(() => {
    (async () => {
      await createTables();
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {!hasProfile ? (
        <ProfileScreen />
      ) : (
        <DrawerWithData
        />
      )}
    </>
  )
}

function DrawerWithData({ onLogOut, initialRouteName }: any) {
  const { t } = useTranslation();
  return (
    <Drawer.Navigator
      initialRouteName='home'
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
          title: t('drawerHome'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        component={HomeStack}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: t('drawerProfile'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: t('drawerSettings'),
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
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userProfile");
    dispatch(logoutProfile());
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={t('btnLogout')}
        labelStyle={{ fontSize: 20 }}
        icon={({ color, size }) => (
          <AntDesign name="logout" size={size} color={color} />
        )}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};
