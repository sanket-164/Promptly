"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import useLoader from "@/hooks/useLoader";
import { PromptGetter } from "@/lib/interactions/dataGetters";
import PromptCard from "../../_components/PromptCard";
import EmptyStateComponent from "@/components/EmptyState";

export default function PromptListingPlace({
  username,
  showDelete,
}: {
  username: string;
  showDelete?: boolean;
}) {
  const { isLoading, data } = useQuery({
    queryFn: () => PromptGetter.getPromptByUserName(username),
    queryKey: ["prompt", username],
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
            <PromptCard
              showDelete={showDelete}
              prompt={pr}
              revalidateKeys={["prompt", username]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
