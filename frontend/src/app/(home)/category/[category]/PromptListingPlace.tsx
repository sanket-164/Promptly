"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { PromptGetter } from "@/lib/interactions/dataGetters";
import useLoader from "@/hooks/useLoader";
import PromptCard from "../../_components/PromptCard";
import EmptyStateComponent from "@/components/EmptyState";

export default function PromptListingPlace({ category }: { category: string }) {
  const { isLoading, data } = useQuery({
    queryFn: () => PromptGetter.getPromptByCategory(category),
    queryKey: ["prompt", category],
  });

  const { setLoading } = useLoader();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (data?.length === 0) {
    return (
      <EmptyStateComponent
        title="No prompts found"
        description="No prompts found in this category. Try another one."
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
            <PromptCard prompt={pr} revalidateKeys={["prompt", category]} />
          </div>
        ))}
      </div>
    </div>
  );
}
