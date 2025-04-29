/* eslint-disable @typescript-eslint/no-explicit-any */
import cookies from "js-cookie";

import { CreatePromptType, LoginType, RegisterType } from "../types";
import { BaseResponse, BaseResponseApi, LoginResponse } from "../types/api";
import { axiosInstance } from "./axios";

export class UserBasicOps {
  static async register(payload: RegisterType): Promise<BaseResponse> {
    const { data } = await axiosInstance.post<BaseResponseApi>(
      "/api/auth/register",
      payload
    );
    return {
      message: data.message || "User registered successfully",
      success: true,
    };
  }

  static async login(
    payload: LoginType
  ): Promise<BaseResponse & { token?: string }> {
    const { data } = await axiosInstance.post<LoginResponse>(
      "/api/auth/login",
      payload
    );
    return {
      message: data.message || "User logged in successfully",
      success: true,
      token: data.token,
    };
  }

  static async verifyToken({}): Promise<BaseResponse> {
    try {
      const { data } = await axiosInstance.get("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
        },
      });
      return {
        message: data?.message || "Token verified successfully",
        success: !!data?.verified,
      };
    } catch (error: any) {
      return {
        message: error?.response?.data?.error || "Token verification failed",
        success: false,
      };
    }
  }
}

export class PromptOps {
  static async createPrompt(payload: CreatePromptType): Promise<BaseResponse> {
    await axiosInstance.post("/api/prompts/create", payload, {
      headers: {
        Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
      },
    });

    return {
      message: "Prompt created successfully",
      success: true,
    };
  }

  static async deletePrompt(id: string): Promise<BaseResponse> {
    await axiosInstance.delete(`/api/prompts/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
      },
    });
    return {
      message: "Prompt deleted successfully",
      success: true,
    };
  }
}

export class VoteOps {
  static async toggleVote(id: string): Promise<BaseResponse> {
    await axiosInstance.post(`/api/votes/toggle/${id}`, null, {
      headers: {
        Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
      },
    });

    return {
      message: "Vote toggled successfully",
      success: true,
    };
  }
}

export class ProfileOps {
  static async updateProfile(payload: {
    username: string;
    email: string;
  }): Promise<BaseResponse> {
    await axiosInstance.patch("/api/user/update", payload, {
      headers: {
        Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
      },
    });

    return {
      message: "Profile updated successfully",
      success: true,
    };
  }
}
