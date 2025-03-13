import GroupForm from "@/app/components/GroupComponent/GroupForm";
import GroupList from "@/app/components/listComponents/groupListComponent/groupList";
import {View} from "react-native";

const GroupPage = () => {
    return (
        <View style={{flex: 1, backgroundColor: '#F9FAFB'}}>
            <GroupForm />
        </View>
    );
}

export default GroupPage;