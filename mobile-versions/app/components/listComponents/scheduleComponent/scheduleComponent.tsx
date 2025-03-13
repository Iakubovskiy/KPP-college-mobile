'use client'
import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import { Column, ActionType } from "../CustomTableComponent/CustomTable";
import {Button, View} from "react-native";
import TeacherService from "../../../services/TeacherService";
import GroupService from "../../../services/GroupService";
import { useRouter } from "expo-router";
import ScheduleService from "@/app/services/ScheduleService";
import StudentService from "@/app/services/StudentService";
import { TouchableOpacity, Text } from "react-native";

interface ScheduleProps {
    id: number;
    role: string;
    period: string;
    day?: string;
    group_id?: number;
}

interface FormatedData {
    id: number;
    spec: string;
    subject: string;
    _day: string;
    time: string;
}

export default function ScheduleComponent({ id, role, period, day, group_id }: ScheduleProps) {
    const [schedule, setSchedule] = useState<FormatedData[]>([]);
    let dataService: TeacherService | GroupService;
    const scheduleService = new ScheduleService();
    const router = useRouter();

    if (period === "day" && !day) {
        return ("Incorrect data");
    }

    if (role === "teacher") {
        dataService = new TeacherService();
    } else if (role === "student") {
        dataService = new GroupService();
    }

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                if (role === "admin") {
                    let data = await scheduleService.getAllSchedules({ day, group_id });
                    let formattedData = data.map((item) => ({
                        ...item,
                        subject: item.subject._name,
                        spec: item.group.name,
                    }));
                    setSchedule(formattedData);
                } else {
                    if (period === "day" && day) {
                        let targetId = id;
                        console.log(role);
                        if(role === 'student'){
                            const studentService = new StudentService();
                            const student = await studentService.getStudentById(id);
                            targetId = student.group.id;
                        }
                        let data = await dataService.getScheduleForDay(targetId, day);
                        let formattedData = data.map((item) => ({
                            ...item,
                            _day: day,
                            spec: "group" in item ? item.group : item.teacher,
                        }));
                        setSchedule(formattedData);
                    } else if (period === "week") {
                        let targetId = id;
                        console.log(role);
                        if(role === 'student'){
                            const studentService = new StudentService();
                            const student = await studentService.getStudentById(id);
                            targetId = student.group.id;
                        }
                        let data = await dataService.getSchedule(targetId, day);
                        console.log(data);
                        let formattedData = data.map((item, index) => ({
                            ...item,
                            _day:item.day,
                            spec: "group" in item ? item.group : item.teacher,
                        }));
                        setSchedule(formattedData);
                    }
                }
            } catch (error) {
                console.error("Помилка при отриманні Кріплень:", error);
            }
        };

        fetchSchedule();
    }, [id, role, period, day, group_id]);

    const scheduleDelete = async (id: number) => {
        const deleted = await scheduleService.deleteSchedule(id);
        if (deleted) {
            setSchedule((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };

    let columns: Column<FormatedData>[] = [
        { name: "День", uid: "_day" },
        { name: "Група | викладач", uid: "spec" },
        { name: "Предмет", uid: "subject" },
        { name: "Час", uid: "time" }
    ];

    let actions: ActionType[] = [];
    if (role === "admin") {
        actions = ['delete'];
    }

    return (
        <View style={{ padding: 16, backgroundColor: '#F9FAFB', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 16 }}>
                <TouchableOpacity
                    onPress={() => { router.push(`/schedule/create`) }}
                    style={{ flex: 1, backgroundColor: 'blue', padding: 10, borderRadius: 5 }}
                    >
                <Text style={{ color: 'white', textAlign: 'center' }}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ flex: 1, backgroundColor: 'green', padding: 10, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>Back</Text>
            </TouchableOpacity>
            </View>
            <CustomTable data={schedule} columns={columns} onDelete={scheduleDelete} actions={actions} entityType="schedule"/>
        </View>
    );
}
