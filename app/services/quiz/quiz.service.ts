import type { AxiosResponse } from "axios";
import { ApiServices } from "../api/api.interceptor";

interface T extends AxiosResponse<any, any> {}

export class QuizServices extends ApiServices {
  static async initiateQuiz(): Promise<any> {
    try {
      const response = await this.post<T>("/quiz/initiate", {}, {});
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        message: err?.response?.data?.message,
      };
    }
  }
}
