import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import GroupService from '@/app/services/GroupService';
import { Card, Button } from "react-native-paper";
import {TextInput, View, Text, StyleSheet,ActivityIndicator} from "react-native";
import button from "react-native-paper/src/components/Button/Button";

const GroupForm = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const groupService = new GroupService();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroup = async () => {
            if (id && id !== '0') {
                try {
                    const group = await groupService.getGroupById(Number(id));
                    setName(group.name);
                } catch (err) {
                    setError('Помилка при завантаженні групи');
                    console.error(err);
                }
            }
        };

        fetchGroup();
    }, [id]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            if (id === '0') {
                await groupService.createGroup({ name });
            } else {
                await groupService.updateGroup(Number(id), { name });
            }
            router.push('/groups');
        } catch (err) {
            setError('Помилка при збереженні групи');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title={id === '0' ? 'Створення нової групи' : 'Редагування групи'}/>
                <Card.Content>
                    <Text>Назва групи</Text>
                    <TextInput
                        placeholder="Введіть назву групи"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style={styles.input}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}


                    <View style={styles.buttonContainer}>
                        <Button
                            mode="text"
                            onPress={() => router.push('/groups')}
                            style={styles.button}
                        >
                            Скасувати
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={loading}
                            style={styles.button}
                        >
                            {loading ? 'Збереження...' : 'Зберегти'}
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    card: {
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
});

export default GroupForm;