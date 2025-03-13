import React, { useEffect, useState } from "react";
import CustomTable, {ActionType} from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import {Button, View} from "react-native";
import GroupService from "../../../services/GroupService";
import {useRouter} from "expo-router";
import Student from "../../../models/Student";

interface StudentListProps {
    group_id:number;
}

export default function StudentsList({group_id}: StudentListProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const groupService = new GroupService();
    const router = useRouter();
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await groupService.getGroupStudents(group_id);
                setStudents(data);
            } catch (error:any) {
                if (error.response?.status === 404) {
                    setStudents([]);
                } else {
                    console.error("Помилка при отриманні студентів:", error);
                }
            }
        };

        fetchStudents();
    }, []);

    const studentDelete = async (id: number) => {
        alert ("No such possibility");
    };

    const columns: Column<Student>[] = [
        { name: "Ім\'я", uid: "first_name" },
        { name: "Прізвище", uid: "surname" },
        { name: "Email", uid: "email" },
    ];

    return (
        <View style={{ padding: 16, backgroundColor: '#F9FAFB', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Button title="Back" color="primary" onPress={() => router.back()}/>
            </View>
            <CustomTable data={students} columns={columns} onDelete={studentDelete} entityType="student" />
        </View>
    );
}
