import HomeCard from '@/components/HomeCard';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import '../../lib/translation';

const CARD_DATA = [
  { title: 'notesLabel', key: 'notes', icon: 'note-outline' },
  { title: 'weatherLabel', key: 'weather', icon: 'weather-partly-snowy-rainy' },
  { title: 'tasksLabel', key: 'tasks', icon: 'check-network-outline' },
  { title: 'newsLabel', key: 'news', icon: 'newspaper' },
];


const HomeScreen = () => {
  const { name } = useSelector((state: any) => state.profile);
  const numColumns = 2;
  const { t } = useTranslation();
  
  return (
      <View style={[styles.container]}>
        {name &&
          <View>
            <Text style={styles.helloTitle}>{t('welcome')}, {name}</Text>
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
