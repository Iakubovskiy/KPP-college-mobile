import Group from "@/app/models/Group";
import Subject from "@/app/models/Subject";

export default interface Schedule {
    id: number;
    group: Group;
    subject: Subject;
    _day: string;
    time: string;
}