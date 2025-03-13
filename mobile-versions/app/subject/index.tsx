import SubjectList from "@/app/components/listComponents/subjectListComponent/subjectList";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View} from "react-native";

const SubjectListPage = () => {
    const [role, setRole] = useState<string>("student");

    useEffect(() => {
        const getRoleFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decoded: { roles?: string[] } = jwtDecode(token);
                    if(decoded.roles?.[0] === "ROLE_ADMIN")
                    setRole("admin");
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
        <View style={{backgroundColor: '#c6c6c5', flex:1}}>
            <SubjectList role={role} />
        </View>
    )
}

export default SubjectListPage;