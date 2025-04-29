import axios, { AxiosInstance } from "axios";

let axiosInstanceLocal: AxiosInstance | null = null;

function createAxiosInstance() {
  if (!axiosInstanceLocal) {
    axiosInstanceLocal = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  return axiosInstanceLocal;
}
export const axiosInstance = createAxiosInstance();
