import Student from "@/app/models/Student";

export default interface Group {
    id: number;
    name: string;
    students: Student[];
}