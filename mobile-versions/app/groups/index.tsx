import GroupList from "@/app/components/listComponents/groupListComponent/groupList";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View} from "react-native";


const GroupPage = () => {
    const [role, setRole] = useState<string>("student");

    useEffect(() => {
        const getRoleFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decoded: { roles?: string[] } = jwtDecode(token);
                    setRole(decoded.roles?.[0] || "Невідома роль");
                } else {
                    setRole("student");
                }
            } catch (error) {
                console.error("Помилка при розшифруванні токена:", error);
                setRole("Некоректний токен");
            }
        };

        getRoleFromToken();
    }, []);


    return (
        <View style={{flex: 1}}>
            <GroupList role={role} />
        </View>
    );
}

export default GroupPage;