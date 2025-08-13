// SettingsScreen.tsx
import { logoutProfile } from "@/store/profile/profileSlice";
import { loadSettings, setLanguage, setTheme } from "@/store/settings/settingsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<any>();

    const { language, isDarkTheme } = useSelector((state: any) => state.settings);

    useEffect(() => {
        dispatch(loadSettings());
    }, [])

    const toggleLanguage = async () => {
        const newLang = language === "en" ? "az" : "en";
        i18n.changeLanguage(newLang)
        dispatch(setLanguage(newLang));
    };

    const toggleTheme = async () => {
        dispatch(setTheme(!isDarkTheme));
    };

    const handleLogout = async () => {
        Alert.alert(t('btnLogout'), t('logoutMessage'), [
            { text: t('btnCancel'), style: "cancel" },
            {
                text: t('btnYes'),
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.removeItem('userProfile');
                    dispatch(logoutProfile());
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, isDarkTheme && styles.darkContainer, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, paddingBottom: insets.bottom }]}>
            <Text style={[styles.title, isDarkTheme && styles.darkText]}>{t('drawerSettings')}</Text>

            {/* Language Toggle */}
            <TouchableOpacity
                style={[styles.option, isDarkTheme && styles.darkOption]}
                onPress={toggleLanguage}
            >
                <Text style={[styles.optionText, isDarkTheme && styles.darkText]}>
                    {t('languageText')}: {language.toUpperCase()}
                </Text>
            </TouchableOpacity>

            {/* Theme Switch */}
            <View style={[styles.option, isDarkTheme && styles.darkOption]}>
                <Text style={[styles.optionText, isDarkTheme && styles.darkText]}>
                    {t('themeText')}: {isDarkTheme ? "Dark" : "Light"}
                </Text>
                <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>{t('btnLogout')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    darkText: {
        color: "#fff",
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        marginBottom: 15,
    },
    darkOption: {
        backgroundColor: "#1f1f1f",
    },
    optionText: {
        fontSize: 16,
    },
    logoutButton: {
        marginTop: "auto",
        backgroundColor: "#e74c3c",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
