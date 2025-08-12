// InitialLaunch.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { useTranslation } from 'react-i18next';
import '../lib/translation';

export default function InitialLaunch({ onFinish, finishTime }: { onFinish?: () => void, finishTime?: number }) {
  const { t } = useTranslation();
  const opacity = useRef(new Animated.Value(0)).current;
  const { name } = useSelector((state: any) => state.profile);
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, finishTime || 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity }]}>
        {t('welcome')}, {name ? name : "Guest"}!
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // You can change the background
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
});
