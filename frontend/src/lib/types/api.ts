import { Prompt, User } from ".";

export interface BaseResponseApi {
  message?: string;
  error?: string;
}

export interface BaseResponse {
  message: string;
  success: boolean;
}

export interface LoginResponse extends BaseResponseApi {
  token?: string;
}

export interface GetUserPrompts {
  prompts: Prompt[];
}

export interface GetProfileResponse {
  message: string;
  user: User;
}
