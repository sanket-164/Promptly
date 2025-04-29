import { create } from "zustand";

export type ModalType =
  | "add-prompt-modal"
  | `test-prompt-${string}`
  | "edit-profile-modal";

interface ModalStore {
  isOpen: boolean;
  modalType: ModalType | null;
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
}

const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  modalType: null,
  openModal: (modalType) => set({ isOpen: true, modalType }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));

export default useModal;
