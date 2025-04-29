/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Button, Dialog, Field, Input, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import useModal from "@/hooks/useModal";
import useRevalidation from "@/hooks/useRevalidate";
import { ProfileOps } from "@/lib/interactions/dataPosters";
import { toaster } from "../ui/toaster";
import Modal from ".";

type Props = {
  username: string;
  email: string;
};

const EditProfileModal = ({ email, username }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<Props>({
    defaultValues: {
      email,
      username,
    },
  });

  useEffect(() => {
    setValue("email", email);
    setValue("username", username);
  }, [email, setValue, username]);

  const { closeModal } = useModal();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ProfileOps.updateProfile,
  });
  const revalidate = useRevalidation();

  function onSubmit(arg: Props) {
    toaster.promise(mutateAsync(arg), {
      loading: {
        title: "Updating profile...",
        description: "Please wait while we update your profile.",
      },
      success(arg) {
        if (arg.success) {
          revalidate(["profile"]);
          closeModal();
        }
        return {
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        };
      },
      error(err: any) {
        return {
          title: "Profile update failed",
          description: err?.response?.data?.error || "Please try again.",
        };
      },
    });
  }
  return (
    <Modal type="edit-profile-modal">
      <Dialog.Header>
        <Dialog.Title>Edit Profile of {username}</Dialog.Title>
      </Dialog.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack p={6} pb={4} spaceY={4}>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input
              placeholder="John Shah"
              {...register("username", {
                required: "username is required",
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "Invalid username",
                },
              })}
              disabled={isPending}
            />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="me@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              disabled={isPending}
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>
          <div className="flex items-center justify-end w-full gap-4">
            <Button
              variant="outline"
              colorScheme="gray"
              loading={isPending}
              disabled={isPending}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              variant="solid"
              type="submit"
              loading={isPending}
              disabled={isPending}
            >
              Save
            </Button>
          </div>
        </VStack>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
