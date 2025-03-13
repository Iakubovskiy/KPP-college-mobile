import React, { useEffect, useState } from "react";
import CustomTable, {ActionType} from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import {Button, View} from "react-native";
import SubjectService from "../../../services/SubjectService"
import {useRouter} from "expo-router";

interface SubjectForTable{
    id: number;
    _name: string;
    hours_per_week: number;
    teacherName: string;
    actions?: string;
}

interface SubjectListProps {
    role:string;
}

export default function SubjectList({role}: SubjectListProps) {
    const [subjects, setSubjects] = useState<SubjectForTable[]>([]);
    const subjectService = new SubjectService();
    const router = useRouter();
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await subjectService.getAllSubjects();
                const new_data = data.map((item)=>({
                    ...item,
                    teacherName: item.teacher.first_name +" "+ item.teacher.surname,
                }));
                setSubjects(new_data);
            } catch (error) {
                console.error("Помилка при отриманні Subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    const subjectDelete = async (id: number) => {
        const deleted = await subjectService.deleteSubject(id);
        if (deleted) {
            setSubjects((prevData)=> prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };


    const columns: Column<SubjectForTable>[] = [
        { name: "Назва", uid: "_name" },
        { name: "Годин на тиждень", uid: "hours_per_week" },
        { name: "Викладач", uid: "teacherName" },
    ];

    let actions: ActionType[] = []
    if(role === "admin"){
        actions = ['edit', 'delete'];
    }else {
        actions = ['view'];
    }

    return (
        <View style={{ padding: 16, backgroundColor: '#F9FAFB', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Button color="success" title="Create" onPress={() => router.push('subject/edit/0' as any)}/>
                    <Button color="primary" title="Back" onPress={()=>router.back()}/>
            </View>
            <CustomTable data={subjects} columns={columns} onDelete={subjectDelete} actions={actions} entityType="subject"/>
        </View>
    );
}