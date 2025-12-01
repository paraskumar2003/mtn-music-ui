import type { AxiosResponse } from "axios";
import { ApiServices } from "../api/api.interceptor";

interface T extends AxiosResponse<any, any> {}

export class QuizServices extends ApiServices {
  static async initiateQuiz(): Promise<any> {
    try {
      const response = await this.post<T>("/quiz/initiate", {});
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        message: err?.response?.data?.message,
      };
    }
  }

  static async answerQuiz(payload: {
    quiz_id: string;
    question_id: string;
    answer: string;
  }): Promise<any> {
    try {
      const response = await this.post<T>("/quiz/answer", payload);
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        message: err?.response?.data?.message,
      };
    }
  }

  static async uploadToS3(file: Blob | File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await this.post<T>("/s3/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { data: res.data.data.url, err: null, message: null };
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        message: err?.response?.data?.message,
      };
    }
  }
}
