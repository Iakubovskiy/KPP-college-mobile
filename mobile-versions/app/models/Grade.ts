import Student from "@/app/models/Student";
import Subject from "@/app/models/Subject";

export default interface Grade {
    id: number;
    student: Student;
    subject: Subject;
    value: number;
    date_and_time: Date;
}