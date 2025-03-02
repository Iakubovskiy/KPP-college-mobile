import Teacher from "@/app/models/Teacher";

export default interface Subject {
    id: number;
    _name: string;
    teacher: Teacher;
    hours_per_week: number;
}