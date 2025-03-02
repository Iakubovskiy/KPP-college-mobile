import APIService from "./ApiService";

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

    async login(username: string, password: string): Promise<{ token: string }> {
        return this.apiService.create("login_check", { username, password });
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
