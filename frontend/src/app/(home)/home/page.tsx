"use client";

import {
  Button,
  Container,
  Field,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Tooltip } from "@/components/ui/tooltip";
import CreatePromptModal from "@/components/modal/CreatePromptModal";
import PromptCard from "../_components/PromptCard";
import useModal from "@/hooks/useModal";
import useLoader from "@/hooks/useLoader";
import { PromptGetter } from "@/lib/interactions/dataGetters";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type SearchFormProps = {
  search: string;
};

const HomePage = () => {
  const { openModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormProps>();
  const { isLoading, data } = useQuery({
    queryFn: PromptGetter.getAllPrompts,
    queryKey: ["prompts"],
  });
  const { setLoading } = useLoader();
  const router = useRouter();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  function onSubmit(data: SearchFormProps) {
    if (data.search !== "") {
      router.push(`/category/${data.search}`);
    }
  }

  return (
    <>
      <Container py={10}>
        <Heading
          size="3xl"
          justifyContent={"space-between"}
          width="full"
          display={"flex"}
        >
          Prompts by community
          <Tooltip
            content="Create a new prompt"
            openDelay={100}
            closeDelay={100}
          >
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => openModal("add-prompt-modal")}
            >
              <Plus />
            </Button>
          </Tooltip>
        </Heading>
        {/* search category  */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "20px" }}>
          <HStack>
            <Field.Root invalid={!!errors.search}>
              <Input
                placeholder="ChatGPT"
                {...register("search", {
                  required: {
                    value: true,
                    message: "Search is required",
                  },
                })}
                background={"white"}
              />
            </Field.Root>
            <Button
              colorScheme="teal"
              variant="surface"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Search
            </Button>
          </HStack>
        </form>
        <div
          className="flex items-center justify-start gap-5 flex-wrap gap-y-10 mt-5"
          style={{
            marginTop: "20px",
          }}
        >
          {data?.content?.map((pr) => (
            <div key={pr.id + "PROMPT_CARD_WRAPPER"}>
              <PromptCard prompt={pr} />
            </div>
          ))}
        </div>
      </Container>

      <CreatePromptModal />
    </>
  );
};

export default HomePage;
