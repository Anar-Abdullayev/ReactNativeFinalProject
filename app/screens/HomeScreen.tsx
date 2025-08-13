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
  const { t } = useTranslation();
  const { name } = useSelector((state: any) => state.profile);
  const { isDarkTheme } = useSelector((state: any) => state.settings);
  const theme = isDarkTheme ? Colors.dark : Colors.light
  const numColumns = 2;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {name &&
        <View>
          <Text style={[styles.helloTitle, {color: theme.text}]}>{t('welcome')}, {name}</Text>
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
