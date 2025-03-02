import APIService from "./ApiService";
import { CreateGradeDTO, UpdateGradeDTO, GradeResponse } from "../dto/grade.types";

class GradesService {
    private apiService: APIService;
    private readonly resource = "grades";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }
    async createGrade(data: CreateGradeDTO): Promise<GradeResponse> {
        return this.apiService.create(this.resource, {
            ...data,
            date_and_time: data.date_and_time || new Date().toISOString()
        });
    }

    async updateGrade(id: number, data: UpdateGradeDTO): Promise<GradeResponse> {
        return this.apiService.update(`${this.resource}`,id, data);
    }
    async deleteGrade(id: number): Promise<void> {
        return this.apiService.delete(`${this.resource}`, id);
    }
}

export default GradesService;