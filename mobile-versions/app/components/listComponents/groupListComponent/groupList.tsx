import React, { useEffect, useState } from "react";
import CustomTable, {ActionType} from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import {Button, View} from "react-native";
import GroupService from "../../../services/GroupService"
import {useRouter} from "expo-router";
import Group from "../../../models/Group";

interface GroupListProps {
    role: string;
}

export default function GroupList({role}: GroupListProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    const groupService = new GroupService();
    const router = useRouter();
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupService.getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error("Помилка при отриманні форм клинків:", error);
            }
        };

        fetchGroups();
    }, []);

    const groupDelete = async (id: number) => {
        const deleted = await groupService.deleteGroup(id);
        if (deleted) {
            setGroups((prevData)=> prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };

    const columns: Column<Group>[] = [
        { name: "Назва", uid: "name" },
    ];

    let actions: ActionType[] = [];
    if(role === "ROLE_ADMIN") {
        actions = ['view','edit', 'delete'];
    }

    return (
        <View style={{ padding: 16, backgroundColor: '#F9FAFB', height: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Button
                    title="Create"
                    color="success"
                    onPress={() => router.push('groups/edit/0' as any)}
                />
                <Button color="primary" title="Back" onPress={() => router.back()}/>
            </View>
            <CustomTable data={groups} columns={columns} onDelete={groupDelete} actions={actions} entityType="groups"/>
        </View>
    );
}