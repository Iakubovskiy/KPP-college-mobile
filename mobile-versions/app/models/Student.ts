import Group from "@/app/models/Group";
import User from "@/app/models/User";

export default interface Student extends User {
    group: Group;
}