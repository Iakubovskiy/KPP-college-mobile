import APIService from "./ApiService";
import { CreateGroupDTO, UpdateGroupDTO, GroupResponse } from "../dto/group.types";
import Student from "../models/Student";
import Schedule from "@/app/models/Schedule";
import Group from "@/app/models/Group";

interface ScheduleResponse{
    id: number;
    teacher: string;
    subject: string;
    day: string;
    time: string;
}

class GroupService {
    private apiService: APIService;
    private readonly resource = "group/";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllGroups(): Promise<Group[]> {
        return this.apiService.getAll(this.resource);
    }

    async getGroupById(id: number): Promise<Group> {
        return this.apiService.getById(this.resource, id);
    }

    async getGroupStudents(id: number): Promise<Student[]> {
        return this.apiService.getAll(`group-students/${id}`);
    }

    async getSchedule(id:number, day?: string): Promise<ScheduleResponse[]> {
        const data:Schedule[] = await this.apiService.getAll(`group-schedule/${id}`);
        const requiredDate:ScheduleResponse[] = data.map((item:Schedule) => ({
            id: item.id,
            teacher: item.subject.teacher.first_name,
            subject: item.subject._name,
            day: item._day,
            time: item.time
        }));
        return (requiredDate.filter((schedule:ScheduleResponse) => {
            let isMatch = true;

            if (day && schedule.day !== day) {
                isMatch = false;
            }

            return isMatch;
        }));
    }

    async getScheduleForDay(id: number, day:string): Promise<ScheduleResponse[]> {
        return this.apiService.getAll(`${this.resource}-schedule/${id}/${day}`);
    }

    async createGroup(data: CreateGroupDTO): Promise<GroupResponse> {
        console.log(data);
        return this.apiService.create(this.resource, data);
    }

    async updateGroup(id: number, data: UpdateGroupDTO): Promise<GroupResponse> {
        return this.apiService.update(this.resource, id, data);
    }

    async deleteGroup(id: number): Promise<boolean> {
        return this.apiService.delete(`${this.resource}`, id);
    }
}

export default GroupService;