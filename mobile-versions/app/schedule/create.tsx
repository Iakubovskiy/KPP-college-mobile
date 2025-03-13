'use client';
import ScheduleForm from "@/app/components/Schedule/ScheduleForm";
import {View} from "react-native";

const schedulePage = () =>{
    return (
        <View style={{flex: 1}}>
            <ScheduleForm />
        </View>
    );
}

export default schedulePage;
