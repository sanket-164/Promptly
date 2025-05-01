import { Container, Heading, Separator } from "@chakra-ui/react";

import PromptListingPlace from "./PromptListingPlace";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

const UserProfile = async (prop: Props) => {
  const username = (await prop.params).username;
  return (
    <Container py={10}>
      <Heading fontSize="2xl" className="flex items-center gap-3">
        Explore prompts by &quot;{username}&quot;
      </Heading>
      <Separator />
      <PromptListingPlace username={username} />
    </Container>
  );
};
export default UserProfile;
