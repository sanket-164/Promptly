import { Container, Heading, Separator } from "@chakra-ui/react";
import React from "react";
import PromptListingPlace from "./PromptListingPlace";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

const CategorySearch = async ({ params }: Props) => {
  const category = (await params).category;
  return (
    <Container py={10}>
      <Heading
        size="3xl"
        justifyContent={"space-between"}
        width="full"
        display={"flex"}
      >
        Explore prompts by &quot;{category}&quot;
      </Heading>
      <Separator />
      <PromptListingPlace category={category} />
    </Container>
  );
};

export default CategorySearch;
