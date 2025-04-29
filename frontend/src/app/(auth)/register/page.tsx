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
import { useMutation } from "@tanstack/react-query";

import { RegisterType } from "@/lib/types";
import { UserBasicOps } from "@/lib/interactions/dataPosters";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

const Register = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<RegisterType>();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: UserBasicOps.register,
  });
  const router = useRouter();
  function onSubmit(data: RegisterType) {
    toaster.promise(mutateAsync(data), {
      loading: {
        title: "Registering...",
        description: "Please wait while we register your account.",
      },
      success(resp) {
        if (resp.success) {
          router.push("/login");
        }
        return {
          title: "Registration successful",
          description: "You have successfully registered your account.",
        };
      },
      error(arg: any) {
        return {
          title: "Registration failed",
          description: arg?.response?.data?.error || "Please try again.",
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
            Register to your account or use an existing one to get started.
          </Card.Description>
        </Card.Header>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card.Body>
            <VStack gap={4}>
              <Field.Root invalid={!!errors.username}>
                <Field.Label>Username</Field.Label>
                <Input
                  placeholder="John Shah"
                  {...register("username", {
                    required: "username is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: "Invalid username",
                    },
                  })}
                  disabled={isPending}
                />
                <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
              </Field.Root>
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
            <ChakraLink
              aria-disabled={isPending}
              asChild
              outline={"none"}
              fontSize={"sm"}
            >
              <NextLink href="/login">Already have account? Login</NextLink>
            </ChakraLink>
            <Button
              type="submit"
              colorPalette="teal"
              variant="outline"
              loading={isPending}
            >
              Register <LuMilestone />
            </Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </div>
  );
};

export default Register;
