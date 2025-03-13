import React from "react";
import { DataTable, IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from 'expo-router'
import { View, Text } from "react-native";

export type ActionType = "view" | "edit" | "delete";

export type Column<T> = {
    name: string;
    uid: keyof T | "actions";
};

type CustomTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    onDelete: (id: number) => void;
    actions?: ActionType[];
    entityType: string;
};
//@typescript-eslint/no-explicit-any
export default function CustomTable<T extends Record<string, any>>({
                                                                       data,
                                                                       columns,
                                                                       onDelete,
                                                                       actions = [],
                                                                       entityType,
                                                                   }: CustomTableProps<T>) {
    const router = useRouter();

    const modifiedColumns: Column<T>[] = actions.length
        ? [...columns, { name: "Дії", uid: "actions" }]
        : columns;

    const renderCell = (item: T, columnKey: keyof T | "actions") => {
        if (columnKey === "actions") {
            return (
                <View style={{flexDirection:"row", gap:8}}>
                    {actions.includes("view") && (
                        <IconButton
                           icon="eye"
                           size={20}
                           onPress={() => router.push(`${entityType}/view/${item.id}` as any)}
                        />
                    )}
                    {actions.includes("edit") && (
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => router.push(`${entityType}/edit/${item.id}` as any)}
                        />
                    )}
                    {actions.includes("delete") && (
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => onDelete(item.id)}/>
                    )}
                </View>
            );
        }
        return item[columnKey];
    };
    return (
        <DataTable>
            <DataTable.Header>
                {modifiedColumns.map((column) => (
                    <DataTable.Title key={String(column.uid)}>
                        {column.name}
                    </DataTable.Title>
                ))}
            </DataTable.Header>
            {data.map((item) => (
                <DataTable.Row key={item.id}>
                    {modifiedColumns.map((column) => (
                        <DataTable.Cell key={String(column.uid)}>
                            {renderCell(item,column.uid)}
                        </DataTable.Cell>
                    ))}
                </DataTable.Row>
            ))}
        </DataTable>
    );
}

