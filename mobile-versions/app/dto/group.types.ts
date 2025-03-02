import Student from '../models/Student';

export interface CreateGroupDTO {
    name: string;
}

export interface UpdateGroupDTO {
    name: string;
}

export interface GroupResponse {
    id: number;
    name: string;
    students: Student[];
}

export interface GroupScheduleResponse {
    id: number;
    subject: string;
    time: string;
}