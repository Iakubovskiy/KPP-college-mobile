import APIService from "./ApiService";
import Student from "@/app/models/Student";
import Group from "@/app/models/Group";
import Subject from "@/app/models/Subject";
import Teacher from "@/app/models/Teacher";

class StudentService {
    private apiService: APIService;
    private readonly resource = "student";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllStudents(): Promise<Student[]> {
        return this.apiService.getAll(this.resource);
    }

    async getStudentById(id: number): Promise<Student> {
        return this.apiService.getById(this.resource, id);
    }

    async getStudentGradesInSubject(studentId: number, subjectId: number): Promise<{ id: number; grade: number; date_and_time: string; teacher: Teacher }[]> {
        return this.apiService.get(`${this.resource}/${studentId}/${subjectId}`);
    }

    async setStudentGroup(studentId: number, groupId: number): Promise<Student> {
        return this.apiService.update(`${this.resource}/${studentId}`, groupId, {});
    }
}

export default StudentService;