import APIService from "./ApiService";
import Student from "../models/Student";
import Subject from "@/app/models/Subject";

interface SubjectDTO {
    name: string;
    hours_per_week: number;
    teacher_id: number;
}

class SubjectService {
    private apiService: APIService;
    private readonly resource = "subject";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllSubjects(): Promise<Subject[]> {
        return this.apiService.getAll(this.resource);
    }

    async getSubjectById(id: number): Promise<Subject> {
        return this.apiService.getById(this.resource, id);
    }


    async createSubject(data: SubjectDTO): Promise<Subject> {
        return this.apiService.create(this.resource, data);
    }

    async updateSubject(id: number, data: SubjectDTO): Promise<Subject> {
        return this.apiService.update(this.resource, id, data);
    }

    async deleteSubject(id: number): Promise<boolean> {
        return this.apiService.delete(`${this.resource}`, id);
    }
}

export default SubjectService;