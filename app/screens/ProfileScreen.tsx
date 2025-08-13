import { setProfile } from '@/store/profile/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import '../../lib/translation';

export default function ProfileScreen() {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const dispatch = useDispatch<any>();
    useEffect(() => {
        loadProfile();
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission to access gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const saveProfile = async () => {
        try {
            const profile = { name, surname, imageUri };
            await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

            Alert.alert("Success", "Profile saved successfully!");
            dispatch(setProfile(name));
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    };

    const loadProfile = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userProfile');
            if (jsonValue != null) {
                const profile = JSON.parse(jsonValue);
                setName(profile.name || '');
                setSurname(profile.surname || '');
                setImageUri(profile.imageUri || null);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <TouchableOpacity onPress={pickImage}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={imageUri ? { uri: imageUri } : require('../../assets/avatar-placeholder.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.changePhotoText}>{t('changePhoto')}</Text>
                </View>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder={t('namePlaceholder')}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder={t('surnamePlaceholder')}
                value={surname}
                onChangeText={setSurname}
            />
            <Button title={t('btnSave')} onPress={saveProfile} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        marginBottom: 10,
    },
    changePhotoText: {
        color: '#007bff',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
});
