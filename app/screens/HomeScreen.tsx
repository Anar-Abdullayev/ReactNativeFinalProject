import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CARD_DATA = [
  { title: 'Notes', key: 'notes' },
  { title: 'Weather', key: 'weather' },
  { title: 'Tasks', key: 'tasks' },
  { title: 'News', key: 'news' },
  { title: 'Profile', key: 'profile' },
  { title: 'Settings', key: 'settings' },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const numColumns = 2; 

  const renderItem = ({ item }: { item: { title: string; key: string } }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.key)}>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={CARD_DATA}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const cardMargin = 12;
const cardWidth = (screenWidth - cardMargin * 3) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#f2f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: cardWidth,
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
  },
});

export default HomeScreen;
