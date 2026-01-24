import type { AxiosResponse } from "axios";
import { ApiServices } from "../api/api.interceptor";

interface LoginPayload {
  email: string;
  name: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  educationLevel: string;
  currentRole: string;
  organization: string;
  assessmentPurpose: string;
  workExperience: string;
  priorTests: boolean;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
  userData?: any;
}

interface T extends AxiosResponse<any, any> {}

export class AuthServices extends ApiServices {
  static async loginWeb(payload: LoginPayload): Promise<any> {
    try {
      const response = await this.post<T>("/users/register", payload);
      return response;
    } catch (err: any) {
      return {
        data: null,
        err: err.message,
        message: err?.response?.data?.message,
      };
    }
  }

  static async verifyOtp(payload: VerifyOtpPayload): Promise<any> {
    try {
      const response = await this.post<T>("/users/verify-otp", payload);
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
