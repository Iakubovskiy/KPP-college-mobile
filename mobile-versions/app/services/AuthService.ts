import APIService from "./ApiService";
import {API_BASE_URL} from "@/app/config";

interface RegisterData{
    role: string,
    email: string,
    password: string,
    name: string,
    surname: string,
    dateOfBirth?: string | null,
    group_id?: number | null
}

class AuthService {
    private apiService: APIService;

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }
    // this.apiService.create("login_check", { username, password })
    async login(username: string, password: string): Promise<{ token: string }> {
        const baseURL = API_BASE_URL;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        const req = await fetch(`${baseURL}/login_check`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({username, password})
            }
        );
        console.log(req.status);
        return await req.json();
    }

    async register(
        userData: RegisterData,
    ): Promise<any> {
        const data: any = { ...userData };
        if (userData.dateOfBirth) data.dateOfBirth = userData.dateOfBirth;
        if (userData.group_id) data.group_id = userData.group_id;

        return this.apiService.create("register", data);
    }
}

export default AuthService;
