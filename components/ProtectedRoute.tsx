import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export function ProtectedRoute({ children }:any) {
  const navigation = useNavigation<any>();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      const profile = await AsyncStorage.getItem('userProfile');
      if (!profile) {
        navigation.replace('profile');
      } else {
        setChecking(false);
      }
    };
    checkUserProfile();
  }, []);

  if (checking) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
