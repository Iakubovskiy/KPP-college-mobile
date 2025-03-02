import Subject from "@/app/models/Subject";
import User from "@/app/models/User";

export default interface Teacher extends User {
    subjects: Subject[];
}
