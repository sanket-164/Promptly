"use client";

import useLoader from "@/hooks/useLoader";
import { PromptGetter } from "@/lib/interactions/dataGetters";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import EmptyStateComponent from "@/components/EmptyState";
import PromptCard from "../_components/PromptCard";

export default function PromptListingPlace() {
  const { isLoading, data } = useQuery({
    queryFn: PromptGetter.getVotedPrompts,
    queryKey: ["prompt", "liked"],
  });

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
            <PromptCard prompt={pr} revalidateKeys={["prompt", "liked"]} />
          </div>
        ))}
      </div>
    </div>
  );
}
