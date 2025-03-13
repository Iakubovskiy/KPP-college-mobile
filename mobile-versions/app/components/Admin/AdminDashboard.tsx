import React from 'react';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export type RootStackParamList = {
    Groups: undefined;
    Subject: undefined;
    Schedule: undefined;
    Register: undefined;
};


const AdminDashboard = () => {
    const router = useRouter();

    const menuItems:{ title: string; icon: string; description: string; path:
        "/groups" | "/subject" | "/schedule" | "/register" }[]= [
        {
            title: 'Групи',
            icon: 'users',
            description: 'Управління групами студентів',
            path: '/groups'
        },
        {
            title: 'Предмети',
            icon: 'book',
            description: 'Управління навчальними предметами',
            path: '/subject'
        },
        {
            title: 'Розклад',
            icon: 'calendar',
            description: 'Управління розкладом занять',
            path: '/schedule'
        },
        {
            title: 'Студенти та викладачі',
            icon: 'graduation-cap',
            description: 'Управління студентами',
            path: '/register'
        }
    ];

    return (
        <View>
                <Text style={styles.title}>Панель адміністратора</Text>
                <View>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => router.push(item.path)} activeOpacity={0.7}>
                            <Card style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconWrapper}>
                                        <Icon name={item.icon} size={24} color="#2563EB" />
                                    </View>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </View>
                                <Text style={styles.cardDescription}>{item.description}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 20,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '100%',
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFF',
        marginBottom: 20,
        padding: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconWrapper: {
        backgroundColor: '#DBEAFE',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    cardDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default AdminDashboard;