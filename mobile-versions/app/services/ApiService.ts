import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
      url: string,
      method: string = "GET",
      //@typescript-eslint/no-explicit-any
      body?: any,
      headers?: HeadersInit
  ): Promise<T> {
    if(!headers) {
      headers = await this.getDefaultHeaders()
    }
    console.log(`${this.baseURL}/${url}`);
    console.log(headers);
    const response = await fetch(`${this.baseURL}/${url}`, {
      method:method,
      headers:headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(response.status);

      if (response.status === 404) {
        return [] as T;
      }

      throw new Error(
          `HTTP Error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    return response.json();
  }

  private async getDefaultHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = await AsyncStorage.getItem("token");
    if (token) {
      headers["Authorization"] = 'Bearer '+token;
    }

    return headers;
  }

  getAll<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(resource);
  }
  get<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(resource);
  }

  getById<T>(resource: string, id: number | string): Promise<T> {
    let localResource;
    if(resource.split('')[resource.length-1] === '/')
    {
      localResource = resource.slice(0, -1);
    }
    else{
      localResource = resource;
    }
    return this.request<T>(`${localResource}/${id}`);
  }
  //@typescript-eslint/no-explicit-any
  create<T>(resource: string, data: any): Promise<T> {
    return this.request<T>(resource, "POST", data);
  }

  //@typescript-eslint/no-explicit-any
  update<T>(resource: string, id: number | string, data: any): Promise<T> {
    let localResource;
    if(resource.split('')[resource.length-1] === '/')
    {
      localResource = resource.slice(0, -1);
    }
    else{
      localResource = resource;
    }
    return this.request<T>(`${localResource}/${id}`, "PUT", data);
  }

  //@typescript-eslint/no-explicit-any
  partialUpdate<T>(resource: string, id: number | string, data: any): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "PATCH", data);
  }

  delete<T>(resource: string, id: number | string): Promise<T> {
    let localResource;
    if(resource.split('')[resource.length-1] === '/')
    {
      localResource = resource.slice(0, -1);
    }
    else{
      localResource = resource;
    }
    return this.request<T>(`${localResource}/${id}`, "DELETE");
  }
}

export default APIService;
