"use client";

import useLoader from "@/hooks/useLoader";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import EmptyStateComponent from "@/components/EmptyState";
import PromptCard from "@/app/(home)/_components/PromptCard";
import { Prompt } from "@/lib/types";

type Props = {
  callerKey: string;
  callerFnPromise: Promise<Prompt[]>;
};

export default function PromptListingPlace({
  callerKey,
  callerFnPromise,
}: Props) {
  const { isLoading, data } = useQuery({
    queryFn: () => callerFnPromise,
    queryKey: ["prompt", callerKey],
  });
  console.log({ data });

  const { setLoading } = useLoader();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (data?.length === 0) {
    return (
      <EmptyStateComponent
        title="No prompts found"
        description="User has not created any prompts yet."
      />
    );
  }

  return (
    <div>
      <div
        className="flex items-center justify-start gap-5 flex-wrap gap-y-10 mt-5"
        style={{
          marginTop: "20px",
        }}
      >
        {data?.map((pr) => (
          <div key={pr.id + "PROMPT_CARD_WRAPPER"}>
            <PromptCard prompt={pr} revalidateKeys={["prompt", callerKey]} />
          </div>
        ))}
      </div>
    </div>
  );
}
