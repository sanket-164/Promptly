/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TestPromptModal from "@/components/modal/TestPromptModal";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import useModal from "@/hooks/useModal";
import useRevalidation from "@/hooks/useRevalidate";
import { PromptOps, VoteOps } from "@/lib/interactions/dataPosters";
import { Prompt } from "@/lib/types";
import {
  Badge,
  Blockquote,
  Button,
  Card,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Copy, CopyCheck, FlaskConical, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  prompt: Prompt;
  revalidateKeys?: string[];
  showDelete?: boolean;
};

const PromptCard = ({ prompt, revalidateKeys, showDelete }: Props) => {
  const [copyPrompt, setCopyPrompt] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: VoteOps.toggleVote,
  });
  const { mutateAsync: mutateAsyncDeletePrompt } = useMutation({
    mutationFn: PromptOps.deletePrompt,
  });
  const revalidate = useRevalidation();
  const { openModal } = useModal();

  function handlePromptCopy() {
    navigator.clipboard.writeText(prompt.content);
    setCopyPrompt(true);
    setTimeout(() => {
      setCopyPrompt(false);
    }, 2000);
  }

  function handleDelete() {
    const cnf = confirm(
      "Are you sure you want to delete this prompt? This action cannot be undone."
    );
    if (!cnf) return;
    toaster.promise(mutateAsyncDeletePrompt(prompt.id), {
      loading: {
        title: "Deleting prompt...",
        description: "Please wait while we delete your prompt.",
      },
      success(item) {
        if (item.success) {
          revalidate(revalidateKeys || ["prompts"]);
        }
        return {
          title: "Prompt deleted",
          description: item.message || "Your prompt has been deleted.",
        };
      },
      error(err: any) {
        return {
          title: "Prompt deletion failed",
          description: err?.response?.data?.error || "Please try again.",
        };
      },
    });
  }

  function handleToggleVote() {
    if (isPending) return;
    toaster.promise(mutateAsync(prompt.id), {
      loading: {
        title: "Toggling vote...",
        description: "Please wait while we toggle your vote.",
      },
      success(item) {
        if (item.success) {
          revalidate(revalidateKeys || ["prompts"]);
        }
        return {
          title: "Vote toggled",
          description: item.message || "Your vote has been toggled.",
        };
      },
      error(err: any) {
        return {
          title: "Vote toggle failed",
          description: err?.response?.data?.error || "Please try again.",
        };
      },
    });
  }

  return (
    <>
      <Card.Root w={420} h={250} position="relative" className="hover:shadow">
        <div className="absolute top-2 right-2">
          <Tooltip content="Copy prompt" openDelay={100} closeDelay={100}>
            <Button
              variant="ghost"
              size="sm"
              colorPalette={copyPrompt ? "green" : "blackAlpha"}
            >
              {copyPrompt ? <CopyCheck /> : <Copy onClick={handlePromptCopy} />}
            </Button>
          </Tooltip>
        </div>
        <Card.Header>
          <Card.Title>{prompt.title}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Blockquote.Root overflow="clip">
            <Blockquote.Icon />
            <Blockquote.Content overflow="clip" lineClamp={3}>
              {prompt.content}
            </Blockquote.Content>
          </Blockquote.Root>
          <p></p>
        </Card.Body>
        <Card.Footer className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <VStack alignItems="start" justifyContent="start" gap={0}>
              <Text
                fontSize={12}
                fontWeight="bold"
                textAlign="left"
                className="hover:underline cursor-pointer"
              >
                <Link href={`/profile/${prompt.userName}`}>
                  {prompt.userName}
                </Link>
              </Text>
              <Text fontSize={10}>
                {new Date(prompt.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </VStack>
          </div>
          <HStack alignItems="center" gap={1}>
            <Badge colorPalette="green">{prompt.category}</Badge>
            <Tooltip content="Upvote">
              <Button
                size="xs"
                variant="ghost"
                colorPalette="blue"
                onClick={handleToggleVote}
                disabled={isPending}
              >
                <ThumbsUp />
                {prompt.upvotes}
              </Button>
            </Tooltip>
            <Tooltip content="Test prompt">
              <Button
                size="xs"
                variant="ghost"
                colorPalette="teal"
                onClick={() => openModal(`test-prompt-${prompt.id}`)}
              >
                <FlaskConical />
              </Button>
            </Tooltip>
            {showDelete && (
              <Tooltip content="Delete prompt">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleDelete}
                  colorPalette="red"
                >
                  <Trash2 />
                </Button>
              </Tooltip>
            )}
          </HStack>
        </Card.Footer>
      </Card.Root>
      <TestPromptModal prompt={prompt} />
    </>
  );
};

export default PromptCard;
