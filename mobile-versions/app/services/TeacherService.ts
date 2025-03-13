import APIService from "./ApiService";
import Teacher from "@/app/models/Teacher";
import Schedule from "@/app/models/Schedule";

interface ScheduleResponse{
    id: number;
    group: string;
    subject: string;
    day: string;
    time: string;
}

class SubjectService {
    private apiService: APIService;
    private readonly resource = "teacher/";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllTeachers():Promise<Teacher[]>{
        return this.apiService.getAll(this.resource);
    }

    async getSchedule(id:number, day?: string): Promise<ScheduleResponse[]> {
        const data:ScheduleResponse[] = await this.apiService.getById(this.resource, id);
        return (data.filter((schedule:ScheduleResponse) => {
            let isMatch = true;

            if (day && schedule.day !== day) {
                isMatch = false;
            }

            return isMatch;
        }));
    }
    async getScheduleForDay(id: number, day:string): Promise<ScheduleResponse[]> {
        return this.apiService.getById(`${this.resource}/${id}`, day);
    }
}

export default SubjectService;