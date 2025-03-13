import React, { useEffect, useState } from 'react';
import GroupService from '../../services/GroupService';
import SubjectService from '../../services/SubjectService';
import GradesService from '../../services/GradesService';
import StudentService from '../../services/StudentService';
import Group from '@/app/models/Group';
import Subject from '@/app/models/Subject';
import Student from '@/app/models/Student';
import {Text, View, Button, ActivityIndicator, StyleSheet, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {DataTable} from "react-native-paper";

interface JournalProps {
    teacherId?: number | null;
    studentId?: number | null;
}

const Journal = ({ teacherId, studentId }: JournalProps) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<Record<number, number[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [openSubject, setOpenSubject] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);
    const [editingGrade, setEditingGrade] = useState<{studentId: number, index: number} | null>(null);
    const [newGrade, setNewGrade] = useState('');

    const groupService = new GroupService();
    const subjectService = new SubjectService();
    const gradesService = new GradesService();
    const studentService = new StudentService();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);

                if (teacherId) {
                    const subjectsData = await subjectService.getAllSubjects();
                    const teacherSubjects = subjectsData.filter(subject =>
                        subject.teacher.id === teacherId
                    );
                    setSubjects(teacherSubjects);

                    const groupsData = await groupService.getAllGroups();
                    setGroups(groupsData);
                } else if (studentId) {
                    const studentData = await studentService.getStudentById(studentId);
                    setGroups([studentData.group]);

                    const subjectsData = await subjectService.getAllSubjects();
                    setSubjects(subjectsData);
                }
            } catch (err) {
                setError('Помилка при завантаженні даних');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [teacherId, studentId]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedGroup) return;

            try {
                setLoading(true);
                const studentsData = await groupService.getGroupStudents(Number(selectedGroup));
                setStudents(studentsData);

                if (selectedSubject) {
                    const gradesPromises = studentsData.map(student =>
                        studentService.getStudentGradesInSubject(
                            student.id,
                            Number(selectedSubject)
                        )
                    );

                    const allGradesResults = await Promise.all(gradesPromises);
                    const gradesObj: Record<number, number[]> = {};
                    studentsData.forEach((student, index) => {
                        gradesObj[student.id] = allGradesResults[index].map(g => g.grade);
                    });

                    setGrades(gradesObj);
                } else {
                    const gradesObj: Record<number, number[]> = {};
                    studentsData.forEach(student => {
                        gradesObj[student.id] = [];
                    });
                    setGrades(gradesObj);
                }
            } catch (err) {
                setError('Помилка при завантаженні студентів');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [selectedGroup, selectedSubject]);

    const handleGradeSubmit = async (studentId: number) => {
        if (!editingGrade || !newGrade) return;

        try {
            setLoading(true);
            await gradesService.createGrade({
                student_id: studentId,
                subject_id: Number(selectedSubject),
                grade: Number(newGrade),
                teacher_id: teacherId!,
            });

            setGrades(prev => ({
                ...prev,
                [studentId]: [...(prev[studentId] || []), Number(newGrade)]
            }));

            setEditingGrade(null);
            setNewGrade('');
        } catch (err) {
            setError('Помилка при збереженні оцінки');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Журнал оцінок</Text>
            </View>
            <View style={styles.form}>
                    <View style={styles.pickerContainer}>
                        <Text>
                            Предмет
                        </Text>
                        <DropDownPicker
                            open={openSubject}
                            value={selectedSubject}
                            items={subjects.map((subject) => ({
                                label: subject._name || 'Без назви',
                                value: subject.id.toString(),
                            }))}
                            setOpen={setOpenSubject}
                            setValue={setSelectedSubject}
                            placeholder="Оберіть предмет"
                            containerStyle={styles.picker}
                            disabled={loading}
                        />
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text>
                            Група
                        </Text>
                        <DropDownPicker
                            open={openGroup}
                            value={selectedGroup}
                            items={groups.map((group) => ({
                                label: group.name,
                                value: group.id.toString(),
                            }))}
                            setOpen={setOpenGroup}
                            setValue={setSelectedGroup}
                            placeholder="Оберіть групу"
                            containerStyle={styles.picker}
                            disabled={loading}
                        />
                    </View>
                </View>
            {error && <Text style={styles.error}>{error}</Text>}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {selectedGroup && selectedSubject && !loading && (
                <DataTable style={{backgroundColor: 'white'}}>
                        <DataTable.Header>
                            <DataTable.Title>Студент</DataTable.Title>
                            <DataTable.Title>Оцінки</DataTable.Title>
                            {teacherId && <DataTable.Title>Дії</DataTable.Title>}
                        </DataTable.Header>

                        {students.map((student) => (
                            <DataTable.Row key={student.id}>
                                <DataTable.Cell>
                                    {student.surname} {student.first_name}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text>
                                        {grades[student.id]?.join(', ') || '—'}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell>
                                    {teacherId && editingGrade?.studentId === student.id ? (
                                        <View style={styles.editingContainer}>
                                            <TextInput
                                                keyboardType="numeric"
                                                value={newGrade}
                                                onChangeText={setNewGrade}
                                                style={styles.gradeInput}
                                            />
                                            <Button
                                                onPress={() => handleGradeSubmit(student.id)}
                                                disabled={loading}
                                                title="OK"
                                            />
                                            <Button
                                                onPress={() => {
                                                    setEditingGrade(null);
                                                    setNewGrade('');
                                                }}
                                                title="✕"/>
                                        </View>
                                    ) : (
                                        teacherId && (
                                            <Button
                                                onPress={() => setEditingGrade({
                                                    studentId: student.id,
                                                    index: grades[student.id]?.length || 0
                                                })}
                                                title="Додати оцінку"
                                            />
                                        )
                                    )}
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 20,
    },
    pickerContainer: {
        marginBottom: 40,
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    table: {
        marginTop: 20,
    },
    tableRow: {
        marginBottom: 20,
    },
    studentName: {
        fontSize: 18,
    },
    gradesContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    grade: {
        marginRight: 10,
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    editingContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    gradeInput: {
        height: 40,
        width: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
    },
});

export default Journal;
