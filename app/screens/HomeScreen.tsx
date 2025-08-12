import HomeCard from '@/components/HomeCard';
import { Colors } from '@/constants/Colors';
import { User } from '@/constants/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const CARD_DATA = [
  { title: 'Notes', key: 'notes', icon: 'note-outline' },
  { title: 'Weather', key: 'weather', icon: 'weather-partly-snowy-rainy' },
  { title: 'Tasks', key: 'tasks', icon: 'check-network-outline' },
  { title: 'News', key: 'news', icon: 'newspaper' },
];


const HomeScreen = () => {
  const [userData, setUserData] = useState<User>();
  const numColumns = 2;
  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('userProfile');
      if (userData) {
        const user: User = JSON.parse(userData);
        setUserData(user);
      }
    })()
  }, [])
  return (
    <View style={[styles.container]}>
      {userData &&
        <View>
          <Text style={styles.helloTitle}>Salam, {userData.name}</Text>
        </View>
      }

      <FlatList
        data={CARD_DATA}
        renderItem={({ item }) => <HomeCard item={item} />}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  helloTitle: {
    fontSize: 36,
    marginBottom: 20,
    fontStyle: 'italic'
  }
});

export default HomeScreen;
