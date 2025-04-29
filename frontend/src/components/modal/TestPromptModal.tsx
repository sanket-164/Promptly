import {
  Button,
  Card,
  Dialog,
  Field,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";

import { Prompt } from "@/lib/types";
import Modal from ".";
import useModal from "@/hooks/useModal";
import { toaster } from "../ui/toaster";

type Props = {
  prompt: Prompt;
};

type FormSchema = {
  prompt: string;
};
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const TestPromptModal = ({ prompt }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      prompt: prompt.content,
    },
  });
  const { closeModal } = useModal();
  const [modelResponse, setModelResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: FormSchema) {
    setLoading(true);
    toaster.promise(
      ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: data.prompt,
      }),
      {
        loading: {
          title: "Testing prompt...",
          description: "Gemini 1.5 flash is testing your prompt",
        },
        success(item) {
          setModelResponse(item.text || "");
          setLoading(false);
          return {
            title: "Prompt tested",
            description: "Your prompt has been tested successfully",
          };
        },
        error(err) {
          console.log(err);
          setLoading(false);
          return {
            title: "Prompt testing failed",
            description: "Something went wrong while testing your prompt",
          };
        },
      }
    );
  }
  return (
    <Modal type={`test-prompt-${prompt.id}`}>
      <Dialog.Header>
        <Dialog.Title>Test Prompt</Dialog.Title>
      </Dialog.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack p={6} width={"100%"} pb={0}>
          <Field.Root invalid={!!errors.prompt}>
            <Field.Label>Prompt</Field.Label>
            <Textarea
              {...register("prompt", {
                required: "Prompt is required",
              })}
              placeholder="Type your prompt here"
              variant="outline"
              rows={5}
              className="resize-none"
              maxH={300}
              minH={150}
              disabled={loading}
            />
            <Field.ErrorText>{errors.prompt?.message}</Field.ErrorText>
          </Field.Root>
          <Dialog.Footer className="flex items-center justify-end w-full">
            <Button disabled={loading} variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Test using Gemini
            </Button>
          </Dialog.Footer>
          {modelResponse !== "" && (
            <Card.Root my={10}>
              <Card.Header>
                <Card.Title>Model Response</Card.Title>
              </Card.Header>
              <Card.Body overflowY="scroll" maxH={120} my={3}>
                <Card.Description>{modelResponse}</Card.Description>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="outline"
                  onClick={() => {
                    setModelResponse("");
                    onSubmit({ prompt: prompt.content });
                  }}
                >
                  Try again
                </Button>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => {
                    navigator.clipboard.writeText(modelResponse);
                    toaster.info({
                      title: "Copied to clipboard",
                      description: "Model response copied to clipboard",
                    });
                  }}
                >
                  Copy Response
                </Button>
              </Card.Footer>
            </Card.Root>
          )}
        </VStack>
      </form>
    </Modal>
  );
};

export default TestPromptModal;
