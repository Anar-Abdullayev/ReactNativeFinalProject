import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from "expo-router";
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import '../lib/translation';

const getColor = (key: string) => {
    let color = ''
    if (key === 'notes')
        color = '#FFF8B5'
    else if (key === 'weather')
        color = '#7BA4B8'
    else if (key === 'tasks')
        color = '#B8E5C0'
    else if (key === 'news')
        color = '#F5A9A4'
    else if (key === 'profile')
        color = '#A7C7E7'
    else if (key === 'settings')
        color = '#F9F9F9'
    return color;
}
const renderIcon = (key: string) => {
    const iconSize = 80;
    const iconColor = 'black'
    let content;
    if (key === 'notes')
        content = <MaterialCommunityIcons name='note-outline' size={iconSize} color={iconColor} />
    else if (key === 'weather')
        content = <MaterialCommunityIcons name='weather-partly-snowy-rainy' size={iconSize} color={iconColor} />
    else if (key === 'tasks')
        content = <MaterialCommunityIcons name='check-network-outline' size={iconSize} color={iconColor} />
    else if (key === 'news')
        content = <MaterialCommunityIcons name='newspaper' size={iconSize} color={iconColor} />
    else if (key === 'profile')
        content = <MaterialCommunityIcons name='face-man-profile' size={iconSize} color={iconColor} />
    else if (key === 'settings')
        content = <Ionicons name='settings-outline' size={iconSize} color={iconColor} />
    return content;
}
const screenWidth = Dimensions.get('window').width;
const cardMargin = 12;
const cardWidth = (screenWidth - cardMargin * 3) / 2;

export default function HomeCard({ item }: any) {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: getColor(item.key) }]} onPress={() => navigation.navigate(item.key)}>
            {renderIcon(item.key)}
            <Text style={styles.cardText}>{t(item.title)}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
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

    }
})