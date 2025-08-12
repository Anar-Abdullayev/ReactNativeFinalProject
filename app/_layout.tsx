import { createTables } from '@/database/db';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import HomeStack from './stack/HomeStack';

const Drawer = createDrawerNavigator();


export default function RootLayout() {
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const profile = await AsyncStorage.getItem('userProfile');

      setInitialRouteName(profile ? 'home' : 'profile');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await createTables();
    })();
  }, []);

  if (!initialRouteName) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName={initialRouteName} screenOptions={{
      headerShown: false,
      drawerLabelStyle: {
        fontSize: 20
      }
    }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name='home' options={{
        title: 'Home', drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
      }} component={HomeStack} />

      <Drawer.Screen name='profile' options={{ title: 'Profile', drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} /> }} component={ProfileScreen} />
      <Drawer.Screen name='settings' options={{ title: 'Settings', drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userProfile');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'profile' }],
      })
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}
