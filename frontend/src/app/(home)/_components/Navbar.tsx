"use client";

import { HStack, Link as ChakraLink, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  function handleLogout() {
    const cnf = confirm(
      "Are you sure you want to logout? This action cannot be undone."
    );
    if (!cnf) return;
    cookies.remove("promptlyAuthToken");
    router.push("/login");
  }
  return (
    <HStack
      justifyContent="space-between"
      px="10"
      py="4"
      shadow="lg"
      roundedBottom={20}
    >
      {/* logo */}
      <Link href="/home">
        <Image
          src="/logo.png"
          alt="logo"
          width={60}
          height={60}
          className="rotate-90 p-4"
        />
      </Link>

      <HStack gap={5}>
        <ChakraLink asChild outline={"none"}>
          <NextLink href="/profile">Profile</NextLink>
        </ChakraLink>
        <ChakraLink asChild outline={"none"}>
          <NextLink href="/liked">Voted prompts</NextLink>
        </ChakraLink>
        <Button
          color={"colorPalette.error"}
          variant="outline"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </HStack>
    </HStack>
  );
};

export default Navbar;
