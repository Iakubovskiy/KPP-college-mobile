'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScheduleService from '../../services/ScheduleService';
import GroupService from '../../services/GroupService';
import SubjectService from '../../services/SubjectService';
import Group from '../../models/Group';
import Subject from '../../models/Subject';
import { StyleSheet, View, Text, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DAYS = [
    { label: 'Понеділок', value: 'monday' },
    { label: 'Вівторок', value: 'tuesday' },
    { label: 'Середа', value: 'wednesday' },
    { label: 'Четвер', value: 'thursday' },
    { label: "П'ятниця", value: 'friday' }
];

const TIMES = [
    "08:30", "10:00", "11:50", "13:20", "14:50"
].map(time => ({ label: time, value: time }));

const ScheduleForm = () => {
    const [openGroup, setOpenGroup] = useState(false);
    const [openSubject, setOpenSubject] = useState(false);
    const [openDay, setOpenDay] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const scheduleService = new ScheduleService();
    const groupService = new GroupService();
    const subjectService = new SubjectService();

    const [formData, setFormData] = useState({
        group_id: '',
        subject_id: '',
        day: '',
        time: ''
    });
    const [groups, setGroups] = useState<Group[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsData, subjectsData] = await Promise.all([
                    groupService.getAllGroups(),
                    subjectService.getAllSubjects()
                ]);
                setGroups(groupsData);
                setSubjects(subjectsData);

                if (id && id !== '0') {
                    const schedule = await scheduleService.getScheduleById(Number(id));
                    setFormData({
                        group_id: schedule.group.id.toString(),
                        subject_id: schedule.subject.id.toString(),
                        day: schedule._day,
                        time: schedule.time,
                    });
                }
            } catch (err) {
                setError('Помилка при завантаженні даних');
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const scheduleData = {
                group_id: Number(formData.group_id),
                subject_id: Number(formData.subject_id),
                day: formData.day,
                time: formData.time
            };

            if (id === '0' || !id) {
                await scheduleService.createSchedule(scheduleData);
            } else {
                await scheduleService.updateSchedule(Number(id), scheduleData);
            }
            router.push('/schedule');
        } catch (err) {
            setError('Помилка при збереженні розкладу');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const groupItems = groups.map(group => ({
        label: group.name,
        value: group.id.toString()
    }));

    const subjectItems = subjects.map(subject => ({
        label: `${subject._name} (${subject.teacher.surname} ${subject.teacher.first_name})`,
        value: subject.id.toString()
    }));

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Група</Text>
                <DropDownPicker
                    open={openGroup}
                    value={formData.group_id}
                    items={groupItems}
                    setOpen={setOpenGroup}
                    setValue={(callback) => {
                        const value = typeof callback === 'function' ? callback(formData.group_id) : callback;
                        handleChange('group_id', String(value));
                    }}

                    placeholder="Оберіть групу"
                    style={styles.select}
                />

                <Text style={styles.label}>Предмет</Text>
                <DropDownPicker
                    open={openSubject}
                    value={formData.subject_id}
                    items={subjectItems}
                    setOpen={setOpenSubject}
                    setValue={(callback) => {
                        const value = typeof callback === 'function' ? callback(formData.subject_id) : callback;
                        handleChange('subject_id', String(value));
                    }}

                    placeholder="Оберіть предмет"
                    style={styles.select}
                />

                <Text style={styles.label}>День</Text>
                <DropDownPicker
                    open={openDay}
                    value={formData.day}
                    items={DAYS}
                    setOpen={setOpenDay}
                    setValue={(callback) => {
                        const value = typeof callback === 'function' ? callback(formData.day) : callback;
                        handleChange('day', String(value));
                    }}
                    placeholder="Оберіть день"
                    style={styles.select}
                />

                <Text style={styles.label}>Час</Text>
                <DropDownPicker
                    open={openTime}
                    value={formData.time}
                    items={TIMES}
                    setOpen={setOpenTime}
                    setValue={(callback) => {
                        const value = typeof callback === 'function' ? callback(formData.time) : callback;
                        handleChange('time', String(value));
                    }}
                    placeholder="Оберіть час"
                    style={styles.select}
                />

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <View style={styles.buttonRow}>
                            <Button
                                onPress={() => router.back()}
                                title="Скасувати"
                            />
                            <Button
                                disabled={loading}
                                title={loading ? 'Збереження...' : 'Зберегти'}
                                onPress={handleSubmit}
                            />
                        </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingVertical: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 12,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    form: {
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    select: {
        height: 44,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 60,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    submitButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#2563EB',
        borderRadius: 8,
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
});

export default ScheduleForm;