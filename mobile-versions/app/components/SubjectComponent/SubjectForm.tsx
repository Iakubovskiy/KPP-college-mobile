import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SubjectService from '@/app/services/SubjectService';
import TeacherService from '@/app/services/TeacherService';
import { Card } from "react-native-paper";
import {View, Text, Button, TextInput, StyleSheet, ActivityIndicator} from "react-native";
import Teacher from '@/app/models/Teacher';
import DropDownPicker from 'react-native-dropdown-picker';

const SubjectForm = () => {
    const router = useRouter();
    const { id } =useLocalSearchParams();
    const subjectService = new SubjectService();
    const teacherService = new TeacherService();

    const [name, setName] = useState('');
    const [teacherId, setTeacherId] = useState<number>(0);
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openTeacher, setOpenTeacher] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {

                const teachersData = await teacherService.getAllTeachers();
                setTeachers(teachersData);
            } catch (err) {
                setError('Помилка при завантаженні списку викладачів');
                console.error(err);
            }
        };

        fetchTeachers();
    }, []);

    useEffect(() => {
        const fetchSubject = async () => {
            if (id && id !== '0') {
                try {
                    const subject = await subjectService.getSubjectById(Number(id));
                    setName(subject._name);
                    setTeacherId(subject.teacher.id);
                    setHoursPerWeek(subject.hours_per_week.toString());
                } catch (err) {
                    setError('Помилка при завантаженні предмету');
                    console.error(err);
                }
            }
        };

        fetchSubject();
        console.log(teacherId);
    }, [id,teachers]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const subjectData = {
                name,
                teacher_id: Number(teacherId),
                hours_per_week: Number(hoursPerWeek)
            };

            if (id === '0') {
                await subjectService.createSubject(subjectData);
            } else {
                await subjectService.updateSubject(Number(id), subjectData);
            }
            router.push('/subject');
        } catch (err) {
            setError('Помилка при збереженні предмету');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text style={styles.title}>
                {id === '0' ? 'Створення нового предмету' : 'Редагування предмету'}
            </Text>
            <Text style={styles.label}>Назва предмету</Text>
            <TextInput
                placeholder="Введіть назву предмету"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
            />
            <Text style={styles.label}>Викладач</Text>
            <DropDownPicker
                open={openTeacher}
                value={teacherId}
                items={teachers.map(teacher => ({
                    label: `${teacher.surname} ${teacher.first_name}`,
                    value: teacher.id,
                }))}
                setOpen={setOpenTeacher}
                setValue={(val) => setTeacherId(val)}
                placeholder="Оберіть викладача"
                style={styles.picker}
            />
            <Text style={styles.label}>Годин на тиждень</Text>
            <TextInput
                keyboardType="numeric"
                placeholder="Введіть кількість годин"
                style={styles.input}
                value={hoursPerWeek}
                onChangeText={(text) => setHoursPerWeek(text)}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <View style={styles.buttonContainer}>
                    <Button title="Скасувати" color="#6c757d" onPress={() => router.push('/subject')} />
                    <Button title="Зберегти" color="#007bff" onPress={handleSubmit} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ced4da',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 15,
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default SubjectForm;