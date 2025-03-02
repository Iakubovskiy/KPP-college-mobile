import Student from "@/app/models/Student";
import Subject from "@/app/models/Subject";
import Teacher from "@/app/models/Teacher";
export interface CreateGradeDTO {
    grade: number;
    student_id: number;
    subject_id: number;
    date_and_time?: string;
    teacher_id:number;
}

export interface UpdateGradeDTO {
    value: number;
}

export interface GradeResponse {
    id: number;
    value: number;
    date_and_time: string;
    student: Student;
    subject: Subject;
    teacher: Teacher;
}