import { useState } from "react";
import AuthService from "@/app/services/AuthService";
import { Card } from "react-native-paper";
import {TextInput, Button, View, Text, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginPage() {
    let [formData, setFormData] = useState({ username: "", password: "" });
    let [error, setError] = useState("");
    const authService = new AuthService();
    const router = useRouter();

    let handleChange = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    let handleSubmit = async () => {
        setError("");
        try {
            let response = await authService.login(formData.username, formData.password);
            console.log(0);
            try {
                await AsyncStorage.setItem("token", response.token);
                console.log(1);
            } catch (error) {
                console.error("Error saving token:", error);
            }

            const decoded: { roles?: string[] } = jwtDecode(response.token);
            console.log("role:", decoded.roles?.[0]);
            if(decoded.roles?.[0] === 'ROLE_ADMIN') {
                router.push("/admin/dashboard");
            }else if(decoded.roles?.[0] === 'ROLE_STUDENT') {
                router.push("/student/dashboard");
            }else if(decoded.roles?.[0] === 'ROLE_TEACHER') {
                router.push("/teacher/dashboard");
            }
        } catch (err: any) {
            setError(`Authentication failed: ${err?.message || "Unknown error"}`);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Login</Text>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder="email"
                            value={formData.username}
                            onChangeText={(value) => handleChange('username', value)}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={formData.password}
                            onChangeText={(value)=>handleChange('password', value)}
                            secureTextEntry
                        />
                        <Button title="Login" onPress={handleSubmit}/>
                </Card.Content>
            </Card>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
    },
    card: {
        width: "90%",
        maxWidth: 400,
        padding: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "black",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: "white",
        color: "black",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
});
export default LoginPage;