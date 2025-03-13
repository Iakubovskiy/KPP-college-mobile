import {useRouter} from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from "react-native-paper";
import React from "react";
import {ScrollView, TouchableOpacity, Text, View} from "react-native";


const Dashboard = ()=> {
    const router = useRouter();

    const menuItems = [
        {
            title: 'Журнал',
            icon: 'book',
            description: 'Журнал з оцінками',
            path: '/journal'
        },
        {
            title: 'Розклад',
            icon: 'calendar',
            description: 'Розкладом занять',
            path: '/schedule'
        }
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb", padding: 20 }}>
            <View style={{ maxWidth: 1200, alignSelf: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#000" }}>
                    Панель студента
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => router.push(item.path)}>
                            <Card style={{ width: 180, marginBottom: 20, padding: 15 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                    <View style={{ padding: 10, backgroundColor: "#dbeafe", borderRadius: 10 }}>
                                        <Icon name={item.icon} size={24} color="#3b82f6" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 10 }}>{item.title}</Text>
                                </View>
                                <Text style={{ color: "#6b7280" }}>{item.description}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default Dashboard;