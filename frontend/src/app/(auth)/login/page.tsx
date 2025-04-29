/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Link as ChakraLink,
  Button,
  Card,
  Field,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { LuMilestone } from "react-icons/lu";
import cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { LoginType } from "@/lib/types";
import { UserBasicOps } from "@/lib/interactions/dataPosters";
import { toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginType>();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: UserBasicOps.login,
  });
  const router = useRouter();
  function onSubmit(data: LoginType) {
    toaster.promise(mutateAsync(data), {
      loading: {
        title: "Logging in...",
        description: "Please wait while we log you in.",
      },
      success(item) {
        if (item.success && item.token) {
          {
            cookies.set("promptlyAuthToken", item.token);
            router.push("/home");
          }
        }
        return {
          title: "Login successful",
          description: "You have successfully logged in.",
        };
      },
      error(err: any) {
        return {
          title: "Login failed",
          description: err?.response?.data?.error || "Please try again.",
        };
      },
    });
  }
  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden">
      <Card.Root>
        <Card.Header>
          <Card.Title>Promptly</Card.Title>
          <Card.Description>
            A simple and elegant prompt marketplace for AI enthusiasts.
            <br />
            Login to your account or create a new one to get started.
          </Card.Description>
        </Card.Header>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card.Body>
            <VStack gap={4}>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  placeholder="me@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={isPending}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  placeholder="********"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  disabled={isPending}
                />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>
            </VStack>
          </Card.Body>
          <Card.Footer className="flex items-center justify-between">
            <ChakraLink asChild outline={"none"} fontSize={"sm"}>
              <NextLink href="/register">
                Don&apos; have an account? Register
              </NextLink>
            </ChakraLink>
            <Button
              colorPalette="teal"
              variant="outline"
              type="submit"
              loading={isPending}
              disabled={isPending}
            >
              Login <LuMilestone />
            </Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </div>
  );
}
