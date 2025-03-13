import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import GroupService from "@/app/services/GroupService";
import AuthService from "@/app/services/AuthService";
import Group from "@/app/models/Group";
import {Text, TextInput, View, Button} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const RegistrationPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [openGroup, setOpenGroup] = useState(false);
    const [openRole, setOpenRole] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        group_id: 0,
        role: ""
    });
    const router = useRouter();
    const authService = new AuthService();
    const groupService = new GroupService();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupService.getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups();
    }, []);

    const handleChange = (name:string, value:string|number) => {
        if (name === "group_id") {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async () => {
        try {
            await authService.register(formData);
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <View style={{ maxWidth: 400, margin: 10, padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Реєстрація</Text>
                <Text>Ім'я</Text>
                <TextInput
                    placeholder="Ім'я"
                    value={formData.name}
                    onChangeText={(value)=>handleChange("name", value)}
                    style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                />
                <Text>Прізвище</Text>
                <TextInput
                    placeholder="Прізвище"
                    value={formData.surname}
                    onChangeText={(value)=>handleChange('surname', value)}
                    style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                />
                <Text>Email</Text>
                <TextInput
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(value)=>handleChange('email', value)}
                    style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                />
                <Text>Пароль</Text>
                <TextInput
                    placeholder="Пароль"
                    value={formData.password}
                    onChangeText={(value)=>handleChange('password', value)}
                    style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                />
                <Text>Група</Text>
                <DropDownPicker
                    open={openGroup}
                    value={formData.group_id}
                    items={groups.map(group => ({ label: group.name, value: group.id }))}
                    setOpen={setOpenGroup}
                    setValue={(callback) => setFormData(prev => ({ ...prev, group_id: callback(prev.group_id) }))}
                    placeholder="Оберіть групу"
                    style={{ borderWidth: 1, marginBottom: 10 }}
                    zIndex={3000}
                    zIndexInverse={1000}
                />

                <Text>Роль</Text>
                <DropDownPicker
                    open={openRole}
                    value={formData.role}
                    items={[
                        { label: "Студент", value: "ROLE_STUDENT" },
                        { label: "Викладач", value: "ROLE_TEACHER" },
                        { label: "Адміністратор", value: "ROLE_ADMIN" },
                    ]}
                    setOpen={setOpenRole}
                    setValue={(callback) => setFormData(prev => ({ ...prev, role: callback(prev.role) }))}
                    placeholder="Оберіть роль"
                    style={{ borderWidth: 1, marginBottom: 10 }}
                    zIndex={2000}
                    zIndexInverse={2000}
                />
                <Button color="#007bff" title="Зареєструватися" onPress={handleSubmit}/>
                <View style={{ marginTop: 10 }}>
                    <Button title="Скасувати" onPress={() => router.back()} color="#6c757d" />
                </View>
        </View>
    );
};

export default RegistrationPage;
