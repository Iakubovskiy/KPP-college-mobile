"use client";
import ScheduleComponent from "@/app/components/listComponents/scheduleComponent/scheduleComponent";
import { useState, useEffect, useMemo } from "react";
import GroupService from "@/app/services/GroupService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Text, View} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const SchedulePage = () => {
    const [token, setToken] = useState<string | null>(null);
    const [tokenData, setTokenData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openDay, setOpenDay] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);
    const groupService = new GroupService();

    const parseJwt = (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem("token");
            setToken(storedToken);
            if (storedToken) {
                setTokenData(parseJwt(storedToken));
            }
            setIsLoading(false);
        }
        getToken();
    }, []);

    const role = useMemo(() => {
        if (!tokenData || !tokenData.roles) return 'student';
        return tokenData.roles.includes('ROLE_ADMIN')
            ? 'admin'
            : tokenData.roles.includes('ROLE_TEACHER')
                ? 'teacher'
                : 'student';
    }, [tokenData]);

    let Id = tokenData?.user_id;

    const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
    const [days] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);

    useEffect(() => {
        if (role === 'admin') {
            groupService.getAllGroups()
                .then((response) => {
                    setGroups(response);
                })
                .catch((error) => {
                    console.error("Помилка при завантаженні груп:", error);
                });
        }else if(role === 'student'){

        }
    }, [role]);

    if (isLoading) return <Text>Завантаження...</Text>;
    if (!token) return <Text>Необхідна авторизація</Text>;


    return (
        <View style={{flex: 1}}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#f3f4f6" }}>
                <View style={{flex: 1}}>
                    <Text style={{ marginBottom: 5 }}>Виберіть день:</Text>
                    <DropDownPicker
                        open={openDay}
                        value={selectedDay || ""}
                        items={days.map((day) => ({ label: day, value: day }))}
                        setOpen={setOpenDay}
                        setValue={(day) => setSelectedDay(day)}
                        placeholder="Виберіть день"
                        style={{ borderWidth: 1, padding: 10, backgroundColor: "white" }}
                    />
                    {role === "admin" && (
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ marginBottom: 5 }}>Виберіть групу:</Text>
                            <DropDownPicker
                                open={openGroup}
                                value={selectedGroup || ""}
                                items={groups.map(group => ({ label: group.name, value: group.id.toString() }))}
                                setOpen={setOpenGroup}
                                setValue={(group) => setSelectedGroup(group)}
                                placeholder="Виберіть групу"
                                style={{ borderWidth: 1, padding: 10, backgroundColor: "white" }}
                            />
                        </View>
                    )}
                </View>
            </View>

            <ScheduleComponent
                id={Id}
                role={role}
                period="week"
                day={selectedDay}
                group_id={selectedGroup ? Number(selectedGroup) : undefined}
            />
        </View>
    );
};

export default SchedulePage;
