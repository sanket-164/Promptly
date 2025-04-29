import { create } from "zustand";

interface LoaderStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoader = create<LoaderStore>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export default useLoader;
