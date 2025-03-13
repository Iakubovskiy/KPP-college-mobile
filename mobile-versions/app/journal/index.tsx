import Journal from "@/app/components/Journal/Journal";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View} from "react-native";

const JournalPage = () => {
    const [id, setId] = useState<string | null>(null);
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const getRoleFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decoded: { user_id?: string, roles?: string[] } = jwtDecode(token);
                    setId(decoded.user_id || null);
                    setRole(decoded.roles?.[0] || "Невідома роль");
                }
            } catch (error) {
                console.error("Помилка при розшифруванні токена:", error);
            }
        };

        getRoleFromToken();
    }, []);
    console.log(id);

    return (
        <View>
            {role === 'ROLE_TEACHER' ? (
                <Journal teacherId={Number(id)} />
            ) : role === 'ROLE_STUDENT' ? (
                <Journal studentId={Number(id)} />
            ) : (
                <View>Невідомий користувач</View>
            )}
        </View>
    );
};

export default JournalPage;
