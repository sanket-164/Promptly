import { Container, Heading, Separator } from "@chakra-ui/react";
import React from "react";
import PromptListingPlace from "./PromptListingPlace";

const LikedPrompt = () => {
  return (
    <Container py={10}>
      <Heading
        size="3xl"
        justifyContent={"space-between"}
        width="full"
        display={"flex"}
      >
        Liked Prompts
      </Heading>
      <Separator />
      <PromptListingPlace />
    </Container>
  );
};

export default LikedPrompt;
