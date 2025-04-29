import { EmptyState, VStack } from "@chakra-ui/react";
import { LuTreePine } from "react-icons/lu";

type Props = {
  title: string;
  description?: string;
};

const EmptyStateComponent = ({ title, description }: Props) => {
  return (
    <div className="h-[60vh] w-full">
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuTreePine />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>{title}</EmptyState.Title>
            <EmptyState.Description>{description}</EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </div>
  );
};

export default EmptyStateComponent;
