import cookies from "js-cookie";

import { axiosInstance } from "./axios";
import { Prompt } from "../types";
import { GetProfileResponse } from "../types/api";

export class PromptGetter {
  static async getUserPrompts(): Promise<Prompt[]> {
    try {
      const { data } = await axiosInstance.get<Prompt[]>(
        "/api/prompts/myprompts",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
          },
        }
      );
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getPromptByUserName(username: string): Promise<Prompt[]> {
    try {
      const { data } = await axiosInstance.get<Prompt[]>(
        `/api/prompts/username/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
          },
        }
      );

      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getPromptByCategory(category: string): Promise<Prompt[]> {
    try {
      const { data } = await axiosInstance.get<Prompt[]>(
        `/api/prompts/category/${category}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
          },
        }
      );
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getVotedPrompts(): Promise<Prompt[]> {
    try {
      const { data } = await axiosInstance.get<Prompt[]>("/api/votes/prompts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
        },
      });
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getAllPrompts(): Promise<{ content: Prompt[] }> {
    try {
      const { data } = await axiosInstance.get("/api/prompts/filter", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      return { content: [] };
    }
  }
}

export class ProfileGetter {
  static async getProfile(): Promise<GetProfileResponse> {
    try {
      const { data } = await axiosInstance.get<GetProfileResponse>(
        "/api/user/profile",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("promptlyAuthToken")}`,
          },
        }
      );
      return data;
    } catch (e) {
      console.log(e);
      return {
        message: "Error fetching profile",
        user: {
          id: 0,
          username: "",
          email: "",
          createdAt: "",
          promptCount: 0,
          voteCount: 0,
        },
      };
    }
  }
}
