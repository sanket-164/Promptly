"use client";

import EditProfileModal from "@/components/modal/EditProfileModal";
import useLoader from "@/hooks/useLoader";
import { ProfileGetter } from "@/lib/interactions/dataGetters";
import { Card, Container, Heading, Separator, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import PromptListingPlace from "./[username]/PromptListingPlace";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryFn: ProfileGetter.getProfile,
    queryKey: ["profile"],
  });
  const { setLoading } = useLoader();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return (
    <>
      <Container py={10}>
        <Heading fontSize="2xl" className="flex items-center gap-3">
          User profile
        </Heading>
        <Separator />

        {/* profile card */}
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Card.Root width={400}>
            <Card.Body gap="2">
              <Card.Title mt="2">{data?.user.username}</Card.Title>
              <Card.Description>
                <Table.Root size="sm">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Email</Table.Cell>
                      <Table.Cell>{data?.user.email}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Created prompts</Table.Cell>
                      <Table.Cell>{data?.user.promptCount}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Liked prompts</Table.Cell>
                      <Table.Cell>{data?.user.voteCount}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Joined on</Table.Cell>
                      <Table.Cell>
                        {new Date(
                          data?.user.createdAt || 0
                        ).toLocaleDateString()}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Card.Description>
            </Card.Body>
            {/* <Card.Footer justifyContent="flex-end">
              <Button
                variant="outline"
                onClick={() => openModal("edit-profile-modal")}
              >
                Edit
              </Button>
            </Card.Footer> */}
          </Card.Root>
        </div>

        {/* user created prompts */}
        <Heading fontSize="2xl" className="flex items-center gap-3">
          My prompts
        </Heading>
        <Separator />
        <PromptListingPlace showDelete username={data?.user.username || ""} />
      </Container>
      <EditProfileModal
        username={data?.user.username || ""}
        email={data?.user.email || ""}
      />
    </>
  );
};

export default ProfilePage;
