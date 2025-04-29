"use client";

import useModal, { ModalType } from "@/hooks/useModal";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import React from "react";

type Props = {
  type: ModalType;
  children: React.ReactNode;
};

const Modal = ({ children, type }: Props) => {
  const { isOpen, modalType, closeModal } = useModal();
  const isModalOpen = isOpen && modalType === type;
  return (
    <Dialog.Root
      open={isModalOpen}
      onOpenChange={closeModal}
      onEscapeKeyDown={closeModal}
      lazyMount
      role="alertdialog"
    >
      <Portal>
        <Dialog.Backdrop
          onClick={() => {}}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default Modal;
