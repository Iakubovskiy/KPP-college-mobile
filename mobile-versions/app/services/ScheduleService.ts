import APIService from "./ApiService";
import Schedule from "../models/Schedule";

interface CreateScheduleDto{
    group_id: number;
    subject_id: number;
    day: string;
    time: string;
}

class ScheduleService {
    private apiService: APIService;
    private readonly resource = "schedule";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllSchedules({ day, group_id }: { day?: string; group_id?: number }): Promise<Schedule[]> {
        const data:Schedule[] = await this.apiService.getAll(this.resource);

        return (data.filter((schedule:Schedule) => {
            let isMatch = true;

            if (day && schedule._day !== day) {
                isMatch = false;
            }

            if (group_id && schedule.group.id !== group_id) {
                isMatch = false;
            }

            return isMatch;
        }));
    }


    async getScheduleById(id: number): Promise<Schedule> {
        return this.apiService.getById(this.resource, id);
    }

    async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
        return this.apiService.create(this.resource, data);
    }

    async updateSchedule(id: number, data: CreateScheduleDto): Promise<Schedule> {
        return this.apiService.update(this.resource, id, data);
    }

    async deleteSchedule(id: number): Promise<boolean> {
        return this.apiService.delete(this.resource, id);
    }
}

export default ScheduleService;
