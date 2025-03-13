import React from "react";
import StudentsList from '@/app/components/listComponents/studentListComponent/studentsList';
import {useLocalSearchParams} from 'expo-router';
import {View} from "react-native";

const studentsPage = () => {
    const {id} = useLocalSearchParams();

    return (
        <View style={{flex: 1}}>
            <StudentsList group_id={Number(id) || 1} />
        </View>
    );
};

export default studentsPage;
