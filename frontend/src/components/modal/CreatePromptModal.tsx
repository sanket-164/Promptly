/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Dialog,
  Field,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import Modal from ".";
import { CreatePromptType } from "@/lib/types";
import useModal from "@/hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import { PromptOps } from "@/lib/interactions/dataPosters";
import { toaster } from "../ui/toaster";
import useRevalidation from "@/hooks/useRevalidate";

const CreatePromptModal = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreatePromptType>();
  const { closeModal } = useModal();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: PromptOps.createPrompt,
  });
  const revalidate = useRevalidation();

  function onSubmit(data: CreatePromptType) {
    toaster.promise(mutateAsync(data), {
      loading: {
        title: "Creating prompt...",
        description: "Please wait while we create your prompt.",
      },
      success(item) {
        if (item.success) {
          reset();
          revalidate(["prompts"]);
          closeModal();
        }
        return {
          title: "Prompt created",
          description: "Your prompt has been created successfully.",
        };
      },
      error(err: any) {
        return {
          title: "Prompt creation failed",
          description: err?.response?.data?.error || "Please try again.",
        };
      },
    });
  }
  return (
    <Modal type="add-prompt-modal">
      <Dialog.Header>
        <Dialog.Title>Create prompt</Dialog.Title>
      </Dialog.Header>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <VStack gap={6} width={"100%"} pb={0} p={6}>
          <Field.Root invalid={!!errors.title}>
            <Field.Label>Prompt title</Field.Label>
            <Input
              placeholder="DALL-E Image"
              {...register("title", {
                required: "Title is required",
              })}
              disabled={isPending}
            />
            <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.content}>
            <Field.Label>Prompt</Field.Label>
            <Textarea
              placeholder="Generate an image of a cat"
              {...register("content", {
                required: "Prompt is required",
              })}
              disabled={isPending}
              maxH={200}
              h={100}
            />
            <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.category}>
            <Field.Label>Category</Field.Label>
            <Input
              placeholder="Image generation"
              {...register("category", {
                required: "Category is required",
              })}
              disabled={isPending}
            />
            <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
          </Field.Root>

          <Dialog.Footer className="flex items-center justify-end w-full">
            <Button variant="outline" onClick={closeModal} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              colorScheme="blue"
              loadingText="Creating..."
              loading={isPending}
            >
              Create
            </Button>
          </Dialog.Footer>
        </VStack>
      </form>
    </Modal>
  );
};

export default CreatePromptModal;
